import time

from app.services.search_service import SearchService
from app.services.merchant_search_service import MerchantSearchService
from app.services.ranking_service import RankingService

from app.config.merchant_config import (
    MERCHANT_PRIORITY,
    OFFICIAL_STORES,
    BRANDS
)


class SearchAgent:

    def __init__(self):

        self.search_service = SearchService()
        self.merchant_service = MerchantSearchService()
        self.ranking = RankingService()

    # ==========================================
    # Create Google Shopping Query
    # ==========================================

    def create_query(self, intent):

        query = []

        if intent.get("color"):
            query.append(intent["color"])

        if intent.get("style"):
            query.append(intent["style"])

        if intent.get("fit"):
            query.append(intent["fit"])

        if intent.get("category"):
            query.append(intent["category"])

        if intent.get("budget"):
            query.append(f"under ₹{intent['budget']}")

        return " ".join(query)

    # ==========================================
    # Select Best Merchant
    # ==========================================

    def select_best_merchant(self, product_title, merchants):

        if not merchants:
            return None

        # -----------------------------
        # 1. Official Brand Store
        # -----------------------------

        for brand in BRANDS:

            if brand.lower() in product_title.lower():

                for merchant in merchants:

                    if brand.lower() in merchant["store"].lower():

                        return merchant

        # -----------------------------
        # 2. Preferred Official Stores
        # -----------------------------

        for merchant in merchants:

            if merchant["store"] in OFFICIAL_STORES:

                return merchant

        # -----------------------------
        # 3. Sort By Priority
        # -----------------------------

        merchants.sort(
            key=lambda x: MERCHANT_PRIORITY.get(
                x["store"],
                999
            )
        )

        return merchants[0]

    # ==========================================
    # Search Products
    # ==========================================

    def search_products(self, intent):

        total_start = time.perf_counter()

        query = self.create_query(intent)

        print(f"\n🔍 Search Query : {query}\n")

        # ---------------------------------
        # Google Shopping Search
        # ---------------------------------

        shopping_start = time.perf_counter()

        products = self.search_service.search_products(query)

        shopping_end = time.perf_counter()

        print(f"🛒 Shopping Search : {shopping_end - shopping_start:.2f}s")

        # ---------------------------------
        # Merchant Search
        # ---------------------------------

        merchant_start = time.perf_counter()

        for product in products:

            merchants = self.merchant_service.search_merchants(
                product.title
            )

            product.merchants = merchants

            buy_now = self.select_best_merchant(
                product.title,
                merchants
            )

            product.buy_now = buy_now

            product.available_on = [

                merchant

                for merchant in merchants

                if buy_now is None

                or merchant["store"] != buy_now["store"]

            ]

        merchant_end = time.perf_counter()

        print(f"🏬 Merchant Search : {merchant_end - merchant_start:.2f}s")

        # ---------------------------------
        # DressAI Ranking
        # ---------------------------------

        for product in products:

            product.score = self.ranking.calculate_score(
                product,
                intent
            )

        products.sort(

            key=lambda p: p.score,

            reverse=True

        )

        for index, product in enumerate(products):

            product.rank = index + 1

            product.ai_pick = (index == 0)

        total_end = time.perf_counter()

        print(f"⚡ TOTAL : {total_end - total_start:.2f}s\n")

        return products