import os

from dotenv import load_dotenv
from serpapi import GoogleSearch

load_dotenv()


class MerchantSearchService:

    def search_merchants(self, product_title):

        query = (
         f"{product_title} "
    "Myntra Amazon Flipkart AJIO Nykaa TataCliQ "
    "SAVANA H&M Zara Snitch Westside Uniqlo"
)

        params = {
        "engine": "google",
        "q": query,
        "gl": "in",
        "hl": "en",
        "api_key": os.getenv("SERPAPI_KEY")
}

        search = GoogleSearch(params)
        results = search.get_dict()

        allowed_domains = {
            "myntra.com": "MYNTRA",
            "amazon.in": "AMAZON",
            "amazon.com": "AMAZON",
            "flipkart.com": "FLIPKART",
            "ajio.com": "AJIO",
            "nykaafashion.com": "NYKAA",
            "tatacliq.com": "TATACLIQ",
            "hm.com": "H&M",
            "zara.com": "ZARA",
            "levi.in": "LEVI'S",
            "levis.com": "LEVI'S",
            "savana.com": "SAVANA",
            "wearsavana.com": "SAVANA",
            "snitch.co.in": "SNITCH",
            "westside.com": "WESTSIDE",
            "uniqlo.com": "UNIQLO",
            "abfrl.in": "ABFRL",
            "lifestylestores.com": "LIFESTYLE",
            "shoppersstop.com": "SHOPPERS STOP",
            "thebearhouse.com": "THE BEAR HOUSE",
            "rare-rabbit.com": "RARE RABBIT",
            "uspoloassn.in": "U.S. POLO ASSN.",
            "jackjones.in": "JACK & JONES",
            "only.in": "ONLY",
            "vero-moda.com": "VERO MODA"
        }

        MERCHANT_PRIORITY = {
        "AMAZON": 1,
        "FLIPKART": 2,
        "MYNTRA": 3,
        "AJIO": 4,
        "TATACLIQ": 5,
        "NYKAA": 6,
        "SAVANA": 7,
        "SNITCH": 8,
        "WESTSIDE": 9,
        "UNIQLO": 10,
        "LEVI'S": 11,
        "H&M": 12,
        "ZARA": 13
}

        merchants = []
        seen = set()

        for item in results.get("organic_results", []):

            link = item.get("link", "").lower()
            if "/seller" in link or "/sellers" in link:
                continue

            for domain, store in allowed_domains.items():

                if domain in link and store not in seen:

                    merchants.append({
                        "store": store,
                        "title": item.get("title"),
                        "link": item.get("link")
                    })

                    seen.add(store)
                    break

        merchants.sort(
    key=lambda x: MERCHANT_PRIORITY.get(x["store"], 999)
)

        return merchants