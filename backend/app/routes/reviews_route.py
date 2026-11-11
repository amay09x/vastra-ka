"""
backend/app/routes/reviews_route.py
=====================================
GET /product-reviews — asynchronous Oxylabs review fetch endpoint.

This route is completely independent of POST /product-details.
The frontend fires both in parallel; neither blocks the other.

Query Parameters
----------------
url : str  — The Flipkart or Amazon India product page URL.

Behaviour
---------
- Validates the URL is from a supported retailer (Flipkart or Amazon).
- Applies a 30-second hard timeout via asyncio.wait_for so a slow Oxylabs
  round-trip never stalls the client indefinitely.
- Returns a graceful JSON error body (never HTTP 5xx) for missing credentials,
  unsupported URLs, timeouts, or empty review sets—the frontend is designed to
  handle all of these without breaking the product detail page.
"""

import asyncio

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

from app.services.review_service import fetch_reviews

router = APIRouter(tags=["Reviews"])

_ROUTE_TIMEOUT_S = 30.0  # outer limit the client waits


@router.get("/product-reviews")
async def product_reviews(
    url: str = Query(
        ...,
        description="Flipkart or Amazon India product URL to fetch reviews for.",
        min_length=10,
        max_length=2048,
    ),
):
    """
    Fetch genuine customer reviews for a product page asynchronously.

    - Calls Oxylabs Universal Scraper in an async context (never blocks the loop).
    - Hard-capped at 30 seconds; returns a timeout error body if exceeded.
    - Returns up to 10 reviews: each with text, rating, and reviewer name only.
    - Returns HTTP 200 always; the ``success`` field tells the frontend whether
      real reviews were found.

    Example
    -------
    GET /product-reviews?url=https://www.flipkart.com/product/p/itm...
    GET /product-reviews?url=https://www.amazon.in/dp/B09XXXX/
    """
    try:
        result = await asyncio.wait_for(
            fetch_reviews(url),
            timeout=_ROUTE_TIMEOUT_S,
        )
    except asyncio.TimeoutError:
        result = {
            "success": False,
            "source":  "unknown",
            "reviews": [],
            "count":   0,
            "error":   (
                f"Review fetch timed out after {int(_ROUTE_TIMEOUT_S)} s. "
                "Oxylabs did not respond in time."
            ),
        }

    return JSONResponse(content={
        "success":  result.get("success", False),
        "source":   result.get("source", "unknown"),
        "url":      url,
        "reviews":  result.get("reviews", []),
        "count":    result.get("count", 0),
        "error":    result.get("error"),
    })

