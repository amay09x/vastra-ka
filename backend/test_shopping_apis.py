import os
import json
import re
import requests

from dotenv import load_dotenv
from urllib.parse import urlparse


# ============================================================
# CONFIG
# ============================================================

load_dotenv()

SERPER_API_KEY = os.getenv("SERPER_KEY")

SHOPPING_URL = "https://google.serper.dev/shopping"
SEARCH_URL = "https://google.serper.dev/search"

QUERY = "men black cotton shirt under 1000"
COUNTRY = "in"
LANGUAGE = "en"

# For testing, resolve only first 5 products.
# Later, change this to 16 for Vastra.
RESOLVE_LIMIT = 16


if not SERPER_API_KEY:
    raise ValueError(
        "SERPER_API_KEY not found in .env file."
    )


HEADERS = {
    "X-API-KEY": SERPER_API_KEY,
    "Content-Type": "application/json",
}


RETAILER_DOMAINS = {
    # Major shopping platforms
    "myntra": "myntra.com",
    "myntra - mnow": "myntra.com",

    "flipkart": "flipkart.com",

    "amazon": "amazon.in",
    "amazon.in": "amazon.in",

    "ajio": "ajio.com",
    "ajio.com": "ajio.com",

    "meesho": "meesho.com",

    # Fashion / lifestyle retailers
    "nykaa": "nykaa.com",
    "nykaaman": "nykaaman.com",
    "nykaa man": "nykaaman.com",

    "tatacliq": "tatacliq.com",
    "tata cliq": "tatacliq.com",

    "bewakoof": "bewakoof.com",

    "limeroad": "limeroad.com",

    "snapdeal": "snapdeal.com",

    "shopclues": "shopclues.com",

    "pantaloons": "pantaloons.com",

    "max fashion": "maxfashion.in",

    "westside": "westside.com",

    "reliance trends": "reliancetrends.com",
}

# ============================================================
# HELPERS
# ============================================================

def get_retailer_domain(source):
    """
    Convert Serper's store/source name into the retailer domain.
    """

    if not source:
        return None

    source_lower = source.lower().strip()

    # Exact match first
    if source_lower in RETAILER_DOMAINS:
        return RETAILER_DOMAINS[source_lower]

    # Partial match
    for retailer_name, domain in RETAILER_DOMAINS.items():
        if retailer_name in source_lower:
            return domain

    return None


def is_valid_retailer_url(url, expected_domain):
    """
    Make sure the URL really belongs to the expected retailer.
    """

    if not url or not expected_domain:
        return False

    try:
        parsed = urlparse(url)

        if parsed.scheme not in ("http", "https"):
            return False

        hostname = parsed.hostname

        if not hostname:
            return False

        hostname = hostname.lower()

        return (
            hostname == expected_domain
            or hostname.endswith("." + expected_domain)
        )

    except Exception:
        return False


def clean_title(title):
    """
    Remove unnecessary characters before sending the product
    title to Google Search.
    """

    if not title:
        return ""

    title = re.sub(r"\s+", " ", title)
    title = title.replace('"', "")
    title = title.replace("'", "")

    return title.strip()


def calculate_title_match(product_title, result_title):
    """
    Simple title similarity score.

    This helps avoid selecting an unrelated product page
    from the same retailer.
    """

    if not product_title or not result_title:
        return 0

    product_words = set(
        re.findall(r"[a-zA-Z0-9]+", product_title.lower())
    )

    result_words = set(
        re.findall(r"[a-zA-Z0-9]+", result_title.lower())
    )

    if not product_words:
        return 0

    common_words = product_words.intersection(result_words)

    return len(common_words) / len(product_words)


# ============================================================
# STEP 1
# SERPER SHOPPING SEARCH
# ============================================================

def search_shopping(query):
    """
    Get products from Google Shopping through Serper.
    """

    payload = {
        "q": query,
        "gl": COUNTRY,
        "hl": LANGUAGE,
        "num": 40,
        "page": 1,
    }

    response = requests.post(
        SHOPPING_URL,
        headers=HEADERS,
        json=payload,
        timeout=30,
    )

    print("\n" + "=" * 70)
    print("SERPER SHOPPING")
    print("=" * 70)

    print("HTTP Status:", response.status_code)

    response.raise_for_status()

    data = response.json()

    with open(
        "serper_response.json",
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            data,
            file,
            indent=2,
            ensure_ascii=False,
        )

    products = data.get("shopping", [])

    print("Products returned:", len(products))
    print("Saved: serper_response.json")

    return products


# ============================================================
# STEP 2
# SERPER NORMAL SEARCH
# ============================================================

def search_retailer_product(product_title, retailer_domain):
    """
    Search Google for the exact product on the retailer website.

    Example:

    site:myntra.com "Roadster Men Black Pure Cotton Casual Shirt"
    """

    product_title = clean_title(product_title)

    if not product_title or not retailer_domain:
        return None

    search_query = (
        f'site:{retailer_domain} "{product_title}"'
    )

    payload = {
        "q": search_query,
        "gl": COUNTRY,
        "hl": LANGUAGE,
        "num": 5,
    }

    try:
        response = requests.post(
            SEARCH_URL,
            headers=HEADERS,
            json=payload,
            timeout=30,
        )

        if response.status_code != 200:
            print(
                f"Search failed: HTTP {response.status_code}"
            )
            return None

        data = response.json()

        organic_results = data.get("organic", [])

        if not organic_results:
            return None

        best_url = None
        best_score = 0

        for result in organic_results:

            url = result.get("link")
            result_title = result.get("title", "")

            if not is_valid_retailer_url(
                url,
                retailer_domain,
            ):
                continue

            score = calculate_title_match(
                product_title,
                result_title,
            )

            if score > best_score:
                best_score = score
                best_url = url

        # Require at least a reasonable title match.
        if best_url and best_score >= 0.20:
            return best_url

        return None

    except requests.RequestException as error:

        print(
            "Retailer search error:",
            error,
        )

        return None

    except Exception as error:

        print(
            "Unexpected resolver error:",
            error,
        )

        return None


# ============================================================
# STEP 3
# RESOLVE ACTUAL RETAILER URL
# ============================================================

def resolve_retailer_url(product):
    """
    Take one Serper Shopping product and find its
    actual retailer URL.
    """

    title = product.get("title")
    source = product.get("source")

    retailer_domain = get_retailer_domain(source)

    print("\n" + "-" * 70)
    print("Product:", title)
    print("Store:", source)
    print("Retailer domain:", retailer_domain)

    if not retailer_domain:

        print("No retailer domain mapping found.")

        return None

    actual_url = search_retailer_product(
        title,
        retailer_domain,
    )

    if actual_url:

        print("ACTUAL RETAILER URL:")
        print(actual_url)

    else:

        print("Retailer URL not found.")

    return actual_url


# ============================================================
# STEP 4
# NORMALIZE PRODUCT
# ============================================================

def normalize_product(product):
    """
    Convert Serper's response into the format Vastra can use.
    """

    normalized = {
        "title": product.get("title"),
        "price": product.get("price"),
        "rating": product.get("rating"),
        "reviews": product.get("ratingCount"),
        "store": product.get("source"),
        "image": product.get("imageUrl"),

        # IMPORTANT:
        # This will contain the actual retailer URL,
        # NOT the Google Shopping URL.
        "link": None,

        "delivery": product.get("delivery"),

        # Keep Google Shopping URL for debugging/reference.
        "googleShoppingLink": product.get("link"),

        "productId": product.get("productId"),
        "position": product.get("position"),
    }

    return normalized


# ============================================================
# MAIN TEST
# ============================================================

def main():

    print("\n")
    print("=" * 70)
    print("VASTRA SHOPPING API TEST")
    print("=" * 70)

    print("Query:", QUERY)
    print("Country:", COUNTRY)
    print("URL resolver: Serper Normal Search")

    # --------------------------------------------------------
    # GET SHOPPING PRODUCTS
    # --------------------------------------------------------

    products = search_shopping(QUERY)

    if not products:

        print("\nNo products returned.")
        return

    # --------------------------------------------------------
    # RESOLVE RETAILER URLS
    # --------------------------------------------------------

    normalized_products = []

    print("\n")
    print("=" * 70)
    print("RESOLVING RETAILER URLS")
    print("=" * 70)

    for index, product in enumerate(
        products[:RESOLVE_LIMIT],
        start=1,
    ):

        print(f"\nResolving product {index}/{RESOLVE_LIMIT}")

        normalized = normalize_product(product)

        actual_url = resolve_retailer_url(
            product
        )

        normalized["link"] = actual_url

        normalized_products.append(normalized)

    # --------------------------------------------------------
    # SAVE FINAL RESULT
    # --------------------------------------------------------

    output = {
        "query": QUERY,
        "provider": "serper",
        "productsReturned": len(products),
        "productsResolved": len(normalized_products),
        "products": normalized_products,
    }

    with open(
        "serper_resolved_products.json",
        "w",
        encoding="utf-8",
    ) as file:

        json.dump(
            output,
            file,
            indent=2,
            ensure_ascii=False,
        )

    # --------------------------------------------------------
    # DISPLAY FINAL PRODUCTS
    # --------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("FINAL PRODUCTS")
    print("=" * 70)

    for index, product in enumerate(
        normalized_products,
        start=1,
    ):

        print(f"\nProduct {index}")
        print("Title:", product["title"])
        print("Price:", product["price"])
        print("Rating:", product["rating"])
        print("Reviews:", product["reviews"])
        print("Store:", product["store"])
        print("Image:", product["image"])

        print("ACTUAL LINK:")
        print(product["link"])

    print("\n")
    print("=" * 70)
    print("TEST FINISHED")
    print("=" * 70)

    print("\nCreated:")
    print("1. serper_response.json")
    print("2. serper_resolved_products.json")


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    main()