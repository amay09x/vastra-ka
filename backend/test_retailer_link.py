import json
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright


def is_google_url(url: str) -> bool:
    if not url:
        return False

    hostname = urlparse(url).hostname or ""
    return hostname.endswith("google.com")


def resolve_retailer_url(google_url: str) -> str | None:
    """
    Open a Google Shopping product page and capture the URL
    after clicking the merchant's 'Visit site' button.
    """

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=False
        )

        page = browser.new_page()

        try:
            print("Opening Google Shopping URL...")
            page.goto(
                google_url,
                wait_until="domcontentloaded",
                timeout=30000
            )

            page.wait_for_timeout(3000)

            print("Current URL:")
            print(page.url)

            # Try the visible "Visit site" button first.
            visit_button = page.get_by_text(
                "Visit site",
                exact=True
            )

            if visit_button.count() > 0:

                print("Visit site button found.")

                # Google may open the merchant in the same
                # tab or a new tab.
                with page.expect_popup(timeout=5000) as popup_info:
                    visit_button.first.click()

                try:
                    merchant_page = popup_info.value
                    merchant_page.wait_for_load_state(
                        "domcontentloaded",
                        timeout=15000
                    )
                    final_url = merchant_page.url

                except Exception:
                    final_url = page.url

            else:
                print("Visit site button not found.")

                # Fallback: inspect links on the page.
                links = page.locator("a").all()

                final_url = None

                for link in links:
                    try:
                        href = link.get_attribute("href")

                        if href and not is_google_url(href):
                            final_url = href
                            break

                    except Exception:
                        continue

            print("Resolved URL:")
            print(final_url)

            return final_url

        except Exception as e:

            print("Resolver error:")
            print(e)

            return None

        finally:
            browser.close()


def main():

    with open(
        "serper_response.json",
        "r",
        encoding="utf-8"
    ) as f:
        data = json.load(f)

    products = data.get("shopping", [])

    if not products:
        print("No shopping products found.")
        return

    # Test ONE product first.
    product = products[1]

    print("=" * 70)
    print("RETAILER URL RESOLUTION TEST")
    print("=" * 70)

    print("Product:")
    print(product.get("title"))

    print("Store:")
    print(product.get("source"))

    print("Google Shopping URL:")
    print(product.get("link"))

    retailer_url = resolve_retailer_url(
        product.get("link")
    )

    print()
    print("=" * 70)
    print("RESULT")
    print("=" * 70)

    if retailer_url:
        print("Retailer URL:")
        print(retailer_url)

    else:
        print("Could not resolve retailer URL.")


if __name__ == "__main__":
    main()