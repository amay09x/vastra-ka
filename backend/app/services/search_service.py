import os

from dotenv import load_dotenv

from app.services.shopping.brightdata_provider import (
    BrightDataProvider,
)
from app.services.shopping.serper_provider import (
    SerperProvider,
)


load_dotenv()


class SearchService:

    MAX_RESULTS = 40

    def __init__(self):

        provider_name = (
            os.getenv(
                "SHOPPING_PROVIDER",
                "brightdata",
            )
            .lower()
            .strip()
        )

        # =====================================================
        # PRIMARY PROVIDER
        # =====================================================

        if provider_name == "brightdata":

            self.provider = BrightDataProvider()
            self.fallback_provider = (
                SerperProvider()
                if os.getenv("SERPER_KEY")
                else None
            )

        # =====================================================
        # SERPER PROVIDER
        # =====================================================

        elif provider_name == "serper":

            self.provider = SerperProvider()
            self.fallback_provider = (
                BrightDataProvider()
                if os.getenv("BRIGHTDATA_API_KEY")
                else None
            )

        else:

            raise ValueError(
                "Unsupported SHOPPING_PROVIDER: "
                f"{provider_name}"
            )

        self.provider_name = provider_name

        print(
            f"🛒 Shopping Provider: "
            f"{provider_name}"
        )

    # =========================================================
    # SEARCH PRODUCTS
    # =========================================================

    def search_products(
        self,
        query,
    ):

        if not query:
            print(
                "⚠️ SearchService received "
                "an empty query."
            )
            return []

        query = str(query).strip()

        if not query:
            return []

        print(
            f"\n🔎 SearchService Query:"
            f"\n{query}"
        )

        products = []

        try:

            products = (
                self.provider.search_products(
                    query
                )
            )

        except Exception as exc:

            print(
                "❌ Shopping provider error: "
                f"{type(exc).__name__}: {exc}"
            )

        if not products and self.fallback_provider is not None:

            print(
                "⚠️ Primary provider returned no products; "
                "retrying with fallback provider."
            )

            try:
                products = self.fallback_provider.search_products(query)
            except Exception as exc:
                print(
                    "❌ Fallback provider error: "
                    f"{type(exc).__name__}: {exc}"
                )
                return []

        if not products:

            print(
                "⚠️ SearchService found "
                "no products."
            )

            return []

        # Keep Vastra's normal 16-product
        # contract.

        products = products[
            :self.MAX_RESULTS
        ]

        print(
            f"✅ SearchService received "
            f"{len(products)} products"
        )

        return products

    # =========================================================
    # PRODUCT DETAILS
    # =========================================================

    def get_product_details(
        self,
        product,
    ):

        if not isinstance(product, dict):
            return {}

        # For now the initial Bright Data
        # shopping result is already normalized.
        #
        # The Google Shopping link is stored
        # in immersive_api.
        #
        # Actual retailer URL resolution can
        # happen separately when required.

        existing_link = product.get(
            "product_link"
        )

        if existing_link:
            return {
                "product_link": existing_link,
                "customer_reviews": [],
            }

        return {
            "product_link": None,
            "customer_reviews": [],
        }