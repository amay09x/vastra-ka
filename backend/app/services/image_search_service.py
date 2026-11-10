import os

from dotenv import load_dotenv
from serpapi import GoogleSearch

load_dotenv()


class ImageSearchService:

    def search_visual_matches(self, image_url):

        try:
            params = {
                "engine": "google_lens",
                "type": "visual_matches",
                "url": image_url,
                "hl": "en",
                "country": "in",
                "api_key": os.getenv("SERPAPI_KEY"),
            }

            search = GoogleSearch(params)
            results = search.get_dict()

        except Exception as e:
            return {
                "success": False,
                "results": [],
                "error": str(e),
            }

        if "error" in results:
            return {
                "success": False,
                "results": [],
                "error": results["error"],
            }

        matches = results.get("visual_matches", [])

        products = []

        # Sources we don't want
        blocked_sources = {
            "pinterest",
            "pinterest.com",
            "pinterest india",
        }

        for item in matches:

            title = (item.get("title") or "").strip()

            source = (item.get("source") or "").strip()

            link = item.get("link")

            image = item.get("image")

            # Skip Pinterest
            source_lower = source.lower()

            if (
                "pinterest" in source_lower
                or "pinterest.com" in source_lower
            ):
                continue

            # Skip results without an image
            if not image:
                continue

            # Skip results without a useful title
            if not title:
                continue

            products.append({
                "title": title,
                "source": source,
                "link": link,
                "image": image,
                "price": item.get("price"),
                "rating": item.get("rating"),
                "reviews": item.get("reviews"),
            })

            # Maximum 8 products
            if len(products) >= 8:
                break

        return {
            "success": True,
            "results": products,
        }