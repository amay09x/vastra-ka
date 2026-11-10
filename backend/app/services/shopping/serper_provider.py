import os
import re
import time
import requests

from app.models.product_model import Product
from app.services.shopping.base import ShoppingProvider


class SerperProvider(ShoppingProvider):

    SEARCH_URL = "https://google.serper.dev/shopping"
    WEB_SEARCH_URL = "https://google.serper.dev/search"

    MAX_RESULTS = 40
    MAX_RETRIES = 3

    def __init__(self):
        self.api_key = os.getenv("SERPER_KEY")

    # =========================================================
    # SERPER REQUEST
    # =========================================================

    def _request(self, query: str):

        if not self.api_key:
            print("❌ SERPER_KEY is missing from environment variables.")
            return {}

        payload = {
            "q": query,
            "gl": "in",
            "hl": "en",
            "num": self.MAX_RESULTS,
        }

        headers = {
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json",
        }

        for attempt in range(1, self.MAX_RETRIES + 1):

            try:

                print(
                    f"\n🔎 Serper Shopping attempt "
                    f"{attempt}/{self.MAX_RETRIES}"
                )

                response = requests.post(
                    self.SEARCH_URL,
                    headers=headers,
                    json=payload,
                    timeout=20,
                )

                response.raise_for_status()

                data = response.json()

                if not isinstance(data, dict):
                    print("❌ Invalid response from Serper.")
                    return {}

                return data

            except requests.exceptions.Timeout as exc:

                print(
                    f"⚠️ Serper timeout "
                    f"(attempt {attempt}/{self.MAX_RETRIES}): {exc}"
                )

            except requests.exceptions.ConnectionError as exc:

                print(
                    f"⚠️ Serper connection error "
                    f"(attempt {attempt}/{self.MAX_RETRIES}): {exc}"
                )

            except requests.exceptions.RequestException as exc:

                print(f"❌ Serper request error: {exc}")
                return {}

            except Exception as exc:

                print(
                    f"❌ Unexpected Serper error: "
                    f"{type(exc).__name__}: {exc}"
                )
                return {}

            if attempt < self.MAX_RETRIES:
                time.sleep(attempt * 1.5)

        print("❌ Serper failed after all retry attempts.")

        return {}

    # =========================================================
    # SEARCH PRODUCTS
    # =========================================================

    def search_products(self, query: str) -> list:

        data = self._request(query)

        if not data:
            return []

        shopping_results = data.get("shopping", []) or []

        print(
            f"🛍️ Serper returned "
            f"{len(shopping_results)} shopping results"
        )

        products = []

        for item in shopping_results[:self.MAX_RESULTS]:

            if not isinstance(item, dict):
                continue

            rating = self._normalise_rating(
                item.get("rating")
            )

            review_count = self._normalise_review_count(
                item.get("ratingCount")
            )

            product = Product(

                product_id=item.get("productId"),

                title=item.get("title"),

                source=item.get("source"),

                # IMPORTANT:
                # Serper's link is usually a Google Shopping URL.
                # Do not expose it as the retailer URL.
                product_link=None,

                thumbnail=item.get("imageUrl"),

                images=(
                    [item.get("imageUrl")]
                    if item.get("imageUrl")
                    else []
                ),

                price=item.get("price"),

                extracted_price=self._extract_price(
                    item.get("price")
                ),

                # KEEP REAL SERPER RATING
                rating=rating,

                # KEEP REAL SERPER REVIEW COUNT
                review_count=review_count,

                customer_reviews=[],

                merchants=[],

                buy_now=None,

                available_on=[],

                extensions=[],

                ai_pick=False,

                rank=None,
            )

            products.append(product)

            # Debug information
            if rating is not None:
                print(
                    f"   ⭐ Rating: {rating} "
                    f"({review_count or 0} reviews)"
                )
            else:
                print(
                    f"   ⚪ No rating supplied by Serper: "
                    f"{item.get('title')}"
                )

        print(
            f"✅ SerperProvider created "
            f"{len(products)} Product objects"
        )

        rated_count = sum(
            1
            for product in products
            if product.rating is not None
        )

        print(
            f"⭐ Rated products in this result: "
            f"{rated_count}/{len(products)}"
        )

        return products

    # =========================================================
    # RATING NORMALIZATION
    # =========================================================

    @staticmethod
    def _normalise_rating(value):

        if value is None:
            return None

        if isinstance(value, bool):
            return None

        if isinstance(value, (int, float)):
            rating = float(value)

            if 0 <= rating <= 5:
                return rating

            return None

        text = str(value).strip()

        if not text:
            return None

        match = re.search(
            r"(\d+(?:\.\d+)?)",
            text
        )

        if not match:
            return None

        try:
            rating = float(match.group(1))

            if 0 <= rating <= 5:
                return rating

        except ValueError:
            pass

        return None

    # =========================================================
    # REVIEW COUNT NORMALIZATION
    # =========================================================

    @staticmethod
    def _normalise_review_count(value):

        if value is None:
            return None

        if isinstance(value, bool):
            return None

        if isinstance(value, int):
            return value

        if isinstance(value, float):
            return int(value)

        text = str(value).strip()

        if not text:
            return None

        match = re.search(
            r"([\d,]+)",
            text
        )

        if not match:
            return None

        try:
            return int(
                match.group(1).replace(",", "")
            )
        except ValueError:
            return None

    # =========================================================
    # PRICE
    # =========================================================

    @staticmethod
    def _extract_price(price):

        if price is None:
            return None

        if isinstance(price, (int, float)):
            return float(price)

        text = str(price)

        match = re.search(
            r"(\d[\d,]*(?:\.\d+)?)",
            text
        )

        if not match:
            return None

        try:
            return float(
                match.group(1).replace(",", "")
            )
        except ValueError:
            return None

    # =========================================================
    # PRODUCT DETAILS
    # =========================================================

    def get_product_details(self, product: dict) -> dict:

        if not isinstance(product, dict):
            return {}

        rating = self._normalise_rating(
            product.get("rating")
        )

        review_count = self._normalise_review_count(
            product.get("ratingCount")
            if product.get("ratingCount") is not None
            else product.get("review_count")
        )

        return {
            "title": product.get("title"),

            "brand": product.get("brand"),

            "thumbnail": (
                product.get("imageUrl")
                or product.get("thumbnail")
            ),

            "images": (
                [product.get("imageUrl")]
                if product.get("imageUrl")
                else []
            ),

            "rating": rating,

            "review_count": review_count,

            "stores": [],

            "customer_reviews": [],
        }

    # =========================================================
    # NORMAL WEB SEARCH
    # =========================================================

    def search_web(self, query):

        if not self.api_key:
            print(
                "❌ SERPER_KEY is missing from environment variables."
            )
            return {}

        payload = {
            "q": query,
            "gl": "in",
            "hl": "en",
            "num": 10,
        }

        headers = {
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json",
        }

        try:

            response = requests.post(
                self.WEB_SEARCH_URL,
                headers=headers,
                json=payload,
                timeout=20,
            )

            response.raise_for_status()

            data = response.json()

            return data if isinstance(data, dict) else {}

        except requests.RequestException as exc:

            print(
                "❌ Serper web search failed: "
                f"{type(exc).__name__}: {exc}"
            )

            return {}

        except Exception as exc:

            print(
                "❌ Unexpected Serper web search error: "
                f"{type(exc).__name__}: {exc}"
            )

            return {}