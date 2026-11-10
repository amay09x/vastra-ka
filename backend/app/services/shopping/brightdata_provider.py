import os

import re

import time

from urllib.parse import quote



import requests

from dotenv import load_dotenv



from app.models.product_model import Product

from app.services.shopping.base import ShoppingProvider





load_dotenv()





class BrightDataProvider(ShoppingProvider):



    API_URL = "https://api.brightdata.com/request"



    MAX_RESULTS = 30

    MAX_RETRIES = 1

    REQUEST_TIMEOUT = 30



    def __init__(self):

        self.api_key = os.getenv("BRIGHTDATA_API_KEY")

        self.zone = os.getenv(

            "BRIGHTDATA_SERP_ZONE",

            "serp_api1",

        )



        if not self.api_key:

            print(

                "❌ BRIGHTDATA_API_KEY is missing "

                "from environment variables."

            )



        print(

            f"🛒 Bright Data Provider initialized | "

            f"Zone: {self.zone}"

        )



    # =========================================================

    # BRIGHT DATA REQUEST

    # =========================================================



    def _request(self, query: str):
        """
    Fetch Google Shopping results through Bright Data SERP API.

    IMPORTANT:
    - Uses BRIGHTDATA_API_KEY
    - Uses existing serp_api1 zone
    - Uses Google Shopping (tbm=shop)
    - Requests parsed JSON (brd_json=1)
    - Does NOT retry the same failed request 3 times
    """

        if not self.api_key:
            print("❌ BRIGHTDATA_API_KEY is missing.")
            return {}

        query = str(query).strip()

        if not query:
            print("❌ Bright Data query is empty.")
            return {}

        google_url = (
            "https://www.google.com/search?"
            f"q={quote(query)}"
            "&tbm=shop"
            "&gl=in"
            "&hl=en"
            "&brd_json=1"
        )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
    }

        payload = {
            "zone": self.zone,
            "url": google_url,
            "format": "raw",
    }

        print("\n" + "=" * 60)
        print("🔎 BRIGHT DATA SHOPPING REQUEST")
        print("=" * 60)
        print(f"Query : {query}")
        print(f"Zone  : {self.zone}")
        print(f"URL   : {google_url}")

        try:
            response = requests.post(
                self.API_URL,
                headers=headers,
                json=payload,
                timeout=self.REQUEST_TIMEOUT,
        )

            print(f"📡 HTTP Status  : {response.status_code}")
            print(
                f"📡 Content-Type : "
                f"{response.headers.get('content-type')}"
        )

            response.raise_for_status()

            response_text = response.text.strip()

            if not response_text:
                print("❌ Bright Data returned an EMPTY response.")
                print(
                "⚠️ This is a Bright Data/provider response "
                "problem, not a product parsing problem."
            )
                return {}

            print(
                "📦 Response preview:\n"
                + response_text[:1500]
        )

        # --------------------------------------------------
        # Try JSON directly
        # --------------------------------------------------

            try:
                raw_data = response.json()
            except ValueError:
                print(
                "❌ Bright Data response is not valid JSON."
            )
                print(
                "Raw response:\n"
                + response_text[:3000]
            )
                return {}

        # --------------------------------------------------
        # Bright Data may return:
        #
        # {
        #     "body": {...}
        # }
        #
        # or:
        #
        # {
        #     "body": "{...}"
        # }
        # --------------------------------------------------

            data = self._unwrap_response(raw_data)

            if not isinstance(data, dict):
                print(
                "❌ Bright Data returned JSON, "
                "but not a dictionary."
            )
                return {}

            print(
                f"✅ Bright Data JSON received "
                f"({len(data)} top-level keys)"
        )

        # Helpful debugging
            print(
                "🔑 Bright Data keys:",
                list(data.keys())[:30]
        )

            return data

        except requests.exceptions.Timeout as exc:
            print(
                f"❌ Bright Data timeout: {exc}"
        )
            return {}

        except requests.exceptions.HTTPError as exc:
            print(
            f"❌ Bright Data HTTP error: {exc}"
        )

            try:
                print(
                "Response body:\n"
                + response.text[:3000]
            )
            except Exception:
                pass

            return {}

        except requests.exceptions.RequestException as exc:
            print(
            f"❌ Bright Data request error: {exc}"
        )
            return {}

        except Exception as exc:
            print(
            "❌ Unexpected Bright Data error: "
            f"{type(exc).__name__}: {exc}"
        )
            return {}



    # =========================================================

    # RESPONSE NORMALIZATION

    # =========================================================



    @staticmethod

    def _unwrap_response(data):



        if not isinstance(data, dict):

            return {}



        # Bright Data may return:

        #

        # {

        #     "body": "{...}"

        # }

        #

        # or:

        #

        # {

        #     "body": {...}

        # }



        body = data.get("body")



        if isinstance(body, dict):

            return body



        if isinstance(body, str):



            try:

                import json



                parsed = json.loads(body)



                if isinstance(parsed, dict):

                    return parsed



            except Exception:

                pass



        return data



    # =========================================================

    # SEARCH PRODUCTS

    # =========================================================



    def search_products(

        self,

        query: str,

    ) -> list:



        if not query:

            return []



        query = str(query).strip()



        if not query:

            return []



        print(

            f"\n🛍️ Bright Data Shopping Query:"

            f"\n{query}"

        )



        data = self._request(query)



        if not data:

            print(

                "⚠️ Bright Data returned "

                "no shopping data."

            )

            return []



        shopping_results = self._extract_shopping_results(

            data

        )



        print(

            f"🛍️ Bright Data returned "

            f"{len(shopping_results)} "

            f"shopping results"

        )



        products = []



        for item in shopping_results:



            if not isinstance(item, dict):

                continue



            product = self._normalize_product(

                item

            )



            if product.title:

                products.append(product)



            if len(products) >= self.MAX_RESULTS:

                break



        print(

            f"✅ BrightDataProvider created "

            f"{len(products)} Product objects"

        )



        rated_count = sum(

            1

            for product in products

            if product.rating is not None

        )



        print(

            f"⭐ Rated products: "

            f"{rated_count}/{len(products)}"

        )



        return products









    # =========================================================

    # =========================================================
    # PRODUCT DETAILS
    # =========================================================

    def get_product_details(self, product):
        """Return product details already available from Bright Data.

        Bright Data shopping search supplies the aggregate rating and
        review count. Individual customer reviews are intentionally not
        fabricated or fetched here.
        """
        if not isinstance(product, dict):
            return {
                "product_link": None,
                "rating": None,
                "review_count": None,
                "customer_reviews": [],
            }

        return {
            "product_link": product.get("product_link"),
            "rating": product.get("rating"),
            "review_count": product.get("review_count"),
            "customer_reviews": [],
        }

    # FIND SHOPPING RESULTS IN BRIGHT DATA RESPONSE

    # =========================================================



    @staticmethod

    def _extract_shopping_results(data):



        possible_keys = [

            "shopping",

            "shopping_results",

            "shopping_results_data",

        ]



        for key in possible_keys:



            results = data.get(key)



            if isinstance(results, list):

                return results



        # Sometimes the shopping section

        # can be nested.



        for value in data.values():



            if isinstance(value, dict):



                nested = (

                    BrightDataProvider

                    ._extract_shopping_results(

                        value

                    )

                )



                if nested:

                    return nested



            elif isinstance(value, list):



                candidates = [

                    item

                    for item in value

                    if isinstance(item, dict)

                    and (

                        "title" in item

                        and (

                            "price" in item

                            or "shop" in item

                        )

                    )

                ]



                if candidates:

                    return candidates



        return []



    # =========================================================

    # NORMALIZE PRODUCT

    # =========================================================



    def _normalize_product(

        self,

        item,

    ):



        title = (

            item.get("title")

            or item.get("name")

            or ""

        )



        source = (

            item.get("shop")

            or item.get("source")

            or item.get("seller_name")

        )



        product_id = (

            item.get("productid")

            or item.get("product_id")

            or item.get("productId")

            or item.get("cid")

        )



        price = (

            item.get("price")

            or item.get("item_price")

            or item.get("total_price")

        )



        rating = self._normalise_rating(

            item.get("rating")

        )



        review_count = self._normalise_review_count(

            item.get("reviews_cnt")

            or item.get("review_count")

            or item.get("reviews")

        )



        images = self._extract_images(

            item

        )



        thumbnail = (

            item.get("image")

            or item.get("image_url")

            or item.get("thumbnail")

            or (

                images[0]

                if images

                else None

            )

        )



        # Bright Data Google Shopping gives

        # a Google Shopping product URL here.

        #

        # IMPORTANT:

        # This is NOT treated as the retailer

        # product URL.

        shopping_link = (

            item.get("link")

            or item.get("url")

        )



        return Product(

            product_id=(

                str(product_id)

                if product_id is not None

                else None

            ),



            # Store the Google Shopping link here.

            # Product link remains None until

            # a verified retailer URL is available.

            immersive_api=shopping_link,



            title=title,

            source=source,



            brand=item.get("brand"),



            product_link=None,



            thumbnail=thumbnail,



            images=images,



            price=(

                str(price)

                if price is not None

                else None

            ),



            original_price=(

                item.get("old_price")

                or item.get("original_price")

            ),



            extracted_price=(

                self._extract_price(price)

            ),



            extracted_original_price=(

                self._extract_price(

                    item.get("old_price")

                    or item.get("original_price")

                )

            ),



            rating=rating,



            review_count=review_count,



            # We deliberately do not fabricate

            # individual reviews.

            customer_reviews=[],



            merchants=[],



            buy_now=None,



            available_on=[],



            description=(

                item.get("description")

            ),



            features=[],



            extensions=self._extract_extensions(

                item

            ),



            ai_pick=False,



            rank=(

                item.get("rank")

                or item.get("global_rank")

            ),



            ai_review=None,

        )



    # =========================================================

    # IMAGES

    # =========================================================



    @staticmethod

    def _extract_images(item):



        images = []



        raw_images = item.get("images")



        if isinstance(raw_images, list):



            for image in raw_images:



                if isinstance(image, str):

                    images.append(image)



        possible_images = [

            item.get("image"),

            item.get("image_url"),

            item.get("thumbnail"),

        ]



        for image in possible_images:



            if (

                isinstance(image, str)

                and image

                not in images

            ):

                images.append(image)



        return images



    # =========================================================

    # EXTENSIONS

    # =========================================================



    @staticmethod

    def _extract_extensions(item):



        extensions = []



        shipping = item.get(

            "shipping"

        )



        if shipping:

            extensions.append(

                f"Shipping: {shipping}"

            )



        return extensions



    # =========================================================

    # PRICE

    # =========================================================



    @staticmethod

    def _extract_price(value):



        if value is None:

            return None



        if isinstance(value, (int, float)):

            return float(value)



        text = str(value)



        text = text.replace(

            ",",

            ""

        )



        match = re.search(

            r"(\d+(?:\.\d+)?)",

            text

        )



        if not match:

            return None



        try:

            return float(

                match.group(1)

            )



        except ValueError:

            return None



    # =========================================================

    # RATING

    # =========================================================



    @staticmethod

    def _normalise_rating(value):



        if value is None:

            return None



        try:



            rating = float(value)



            if 0 <= rating <= 5:

                return rating



        except (

            TypeError,

            ValueError,

        ):

            pass



        return None



    # =========================================================

    # REVIEW COUNT

    # =========================================================



    @staticmethod

    def _normalise_review_count(value):



        if value is None:

            return None



        if isinstance(value, int):

            return value



        if isinstance(value, float):

            return int(value)



        text = str(value)



        text = text.replace(

            ",",

            ""

        )



        match = re.search(

            r"(\d+)",

            text

        )



        if not match:

            return None



        try:

            return int(

                match.group(1)

            )



        except ValueError:

            return None