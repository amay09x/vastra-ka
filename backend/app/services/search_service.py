import os

from dotenv import load_dotenv
from serpapi import GoogleSearch

from app.models.product_model import Product

load_dotenv()


class SearchService:

    def search_products(self, query):

        params = {
            "engine": "google_shopping",
            "q": query,
            "gl": "in",
            "hl": "en",
            "api_key": os.getenv("SERPAPI_KEY")
        }

        search = GoogleSearch(params)

        results = search.get_dict()

        # Print only the first product once (for debugging)
        first_item = results.get("shopping_results", [])

        if first_item:
            print("\n========== RAW SHOPPING RESULT ==========\n")
            print(first_item[0])
            print("\n=========================================\n")

        products = []

        for item in results.get("shopping_results", [])[:10]:

            product = Product(

                product_id=item.get("product_id"),
                immersive_api=item.get("serpapi_immersive_product_api"),

                title=item.get("title"),

                thumbnail=item.get("thumbnail"),

                images=[],

                ai_pick=False,

                rank=None,

                price=item.get("price"),

                rating=item.get("rating"),

                review_count=item.get("reviews"),

                customer_reviews=[],

                buy_now=None,

                available_on=[],

                ai_review=None

            )

            products.append(product)

        return products