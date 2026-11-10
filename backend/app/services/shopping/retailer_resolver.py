from urllib.parse import urlparse


class RetailerResolver:

    """
    Lightweight retailer URL validator.

    IMPORTANT:

    - Never invent retailer URLs.
    - Never search another provider just to find a URL.
    - Never scrape retailer pages for reviews.
    - Never fabricate review content.

    A retailer URL is accepted only when it is
    already supplied by a trusted provider.
    """

    RETAILER_DOMAINS = {

        "myntra": "myntra.com",
        "myntra.com": "myntra.com",

        "amazon": "amazon.in",
        "amazon.in": "amazon.in",

        "flipkart": "flipkart.com",
        "flipkart.com": "flipkart.com",

        "ajio": "ajio.com",
        "ajio.com": "ajio.com",

        "nykaa man": "nykaaman.com",
        "nykaaman": "nykaaman.com",
        "nykaaman.com": "nykaaman.com",

        "meesho": "meesho.com",
        "meesho.com": "meesho.com",

        "tata cliq": "tatacliq.com",
        "tatacliq": "tatacliq.com",

        "bewakoof": "bewakoof.com",
        "bewakoof.com": "bewakoof.com",

        "snapdeal": "snapdeal.com",
        "snapdeal.com": "snapdeal.com",

        "croma": "croma.com",
        "croma.com": "croma.com",

        "reliance digital":
            "reliancedigital.in",

        "reliancedigital.in":
            "reliancedigital.in",

        "gocolors": "gocolors.com",
        "gocolors.com": "gocolors.com",

        "go colors": "gocolors.com",
    }

    # =========================================================
    # EXPECTED DOMAIN
    # =========================================================

    @classmethod
    def get_expected_domain(
        cls,
        source,
    ):

        if not source:
            return None

        source_lower = (
            str(source)
            .lower()
            .strip()
        )

        for key, domain in (
            cls.RETAILER_DOMAINS.items()
        ):

            if key in source_lower:
                return domain

        return None

    # =========================================================
    # VALIDATE URL
    # =========================================================

    @staticmethod
    def is_valid_retailer_url(
        url,
        expected_domain,
    ):

        if not url or not expected_domain:
            return False

        try:

            parsed = urlparse(url)

            if parsed.scheme not in {
                "http",
                "https",
            }:
                return False

            hostname = (
                parsed.hostname
                or ""
            ).lower()

            return (
                hostname == expected_domain
                or hostname.endswith(
                    "." + expected_domain
                )
            )

        except Exception:

            return False

    # =========================================================
    # ACCEPT ONLY ALREADY VERIFIED URL
    # =========================================================

    def enrich_product(
        self,
        product,
    ):

        if not isinstance(product, dict):
            return {
                "product_link": None,
                "customer_reviews": [],
            }

        product_link = (
            product.get(
                "product_link"
            )
        )

        source = product.get(
            "source"
        )

        expected_domain = (
            self.get_expected_domain(
                source
            )
        )

        if (
            product_link
            and expected_domain
            and self.is_valid_retailer_url(
                product_link,
                expected_domain,
            )
        ):

            return {
                "product_link": product_link,
                "customer_reviews": [],
            }

        return {
            "product_link": None,
            "customer_reviews": [],
        }