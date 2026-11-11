"""
backend/app/services/review_service.py
=======================================
Fetches and parses genuine customer reviews from Flipkart and Amazon India
product pages using the Oxylabs Web API (Search / Scraper standard).

Design decisions
----------------
- Uses Oxylabs Web API standard endpoint: https://webapi.oxylabs.io/v1/search
- Authenticates using HTTP Bearer Token: Authorization: Bearer {OXYLABS_API_KEY}
- Fully async via httpx.AsyncClient — never blocks the FastAPI event loop.
- Parses ONLY: review text, numeric rating, and reviewer name.
  No invented content, no AI embellishment.
- Hard caps at 10 reviews to keep payloads manageable.
- Explicit timeout: 25 s for the Oxylabs network round-trip.
  The route layer adds its own 30 s asyncio.wait_for wrapper.

Supported sources
-----------------
- flipkart.com  — reviews at /product-reviews/... or any product URL.
- amazon.in     — reviews via standard product URL (Oxylabs follows to reviews).

Credentials
-----------
OXYLABS_API_KEY read from backend/.env.
"""

from __future__ import annotations

import os
import re
from typing import Any

import httpx
from dotenv import load_dotenv

load_dotenv()

_OXYLABS_API = "https://webapi.oxylabs.io/v1/search"
_TIMEOUT_S   = 25.0
_MAX_REVIEWS = 10

_PLACEHOLDER_MARKERS = (
    "placeholder",
    "your-oxylabs",
    "your_oxylabs",
    "your-api-key",
    "your_api_key",
    "<api_key>",
    "<key>",
    "",
)


def _get_api_key() -> str:
    """Return OXYLABS_API_KEY or raise if not configured."""
    api_key = os.getenv("OXYLABS_API_KEY", "").strip()
    if not api_key or api_key.lower() in _PLACEHOLDER_MARKERS:
        raise ValueError(
            "OXYLABS_API_KEY is not configured in backend/.env."
        )
    return api_key


def _detect_source(url: str) -> str:
    """Return the Oxylabs source name for a given product URL."""
    lower = url.lower()
    if "amazon.in" in lower or "amazon.com" in lower:
        return "amazon"
    if "flipkart.com" in lower:
        return "universal"
    return "universal"


def _reviews_url_for(url: str) -> str:
    """
    For Flipkart, convert any product URL to the /product-reviews/... path
    so Oxylabs scrapes the reviews tab directly.
    """
    lower = url.lower()
    if "flipkart.com" in lower:
        # e.g. /.../<product>/p/itm... → /.../<product>/product-reviews/itm...
        url = re.sub(
            r"/p/(itm[^?#&]*)",
            r"/product-reviews/\1",
            url,
            flags=re.IGNORECASE,
        )
    return url


# ── Parsers ───────────────────────────────────────────────────────────────────

def _parse_flipkart_reviews(results: list[dict]) -> list[dict]:
    """
    Parse Oxylabs 'universal' results for Flipkart review pages.

    Oxylabs returns structured `results[0]["content"]` as parsed HTML or
    raw HTML. We handle both the structured dict path and the raw HTML
    fallback with a regex.
    """
    reviews: list[dict] = []

    for result in results:
        content = result.get("content") or {}

        # ── Structured path (Oxylabs parses HTML into dicts) ──────────────
        if isinstance(content, dict):
            parsed = content.get("reviews") or content.get("results") or []
            for item in parsed:
                if not isinstance(item, dict):
                    continue
                text = (
                    item.get("text")
                    or item.get("body")
                    or item.get("description")
                    or ""
                ).strip()
                if not text:
                    continue
                rating_raw = item.get("rating") or item.get("stars") or None
                try:
                    rating = float(rating_raw) if rating_raw is not None else None
                except (TypeError, ValueError):
                    rating = None
                name = (
                    item.get("author")
                    or item.get("user")
                    or item.get("reviewer")
                    or ""
                ).strip()
                reviews.append({
                    "text":   text,
                    "rating": rating,
                    "author": name or None,
                })
                if len(reviews) >= _MAX_REVIEWS:
                    return reviews

        # ── Raw HTML fallback ──────────────────────────────────────────────
        elif isinstance(content, str):
            # Flipkart review structure: col _27M-fz → rating, _11gd4E → review text
            text_matches = re.findall(
                r'class="[^"]*(?:t-ZTKy|_11gd4E|row-title|_6K-7Co)[^"]*"[^>]*>([^<]{20,})</[a-z]',
                content,
            )
            rating_matches = re.findall(
                r'class="[^"]*_1lRcqv[^"]*"[^>]*>(\d(?:\.\d)?)</[a-z]',
                content,
            )
            name_matches = re.findall(
                r'class="[^"]*_2V5EHH[^"]*"[^>]*>([^<]+)</[a-z]',
                content,
            )
            for i, text in enumerate(text_matches[:_MAX_REVIEWS]):
                try:
                    r = float(rating_matches[i]) if i < len(rating_matches) else None
                except (ValueError, TypeError):
                    r = None
                n = name_matches[i].strip() if i < len(name_matches) else None
                reviews.append({"text": text.strip(), "rating": r, "author": n})

        if len(reviews) >= _MAX_REVIEWS:
            break

    return reviews[:_MAX_REVIEWS]


def _parse_amazon_reviews(results: list[dict]) -> list[dict]:
    """
    Parse Oxylabs 'amazon' source results.

    Oxylabs returns structured review objects under results[0]["content"].
    """
    reviews: list[dict] = []

    for result in results:
        content = result.get("content") or {}

        if isinstance(content, dict):
            # Oxylabs Amazon structured output
            for item in (
                content.get("reviews")
                or content.get("customer_reviews")
                or []
            ):
                if not isinstance(item, dict):
                    continue
                text = (
                    item.get("content")
                    or item.get("text")
                    or item.get("body")
                    or ""
                ).strip()
                if not text:
                    continue
                try:
                    rating = float(
                        item.get("rating") or item.get("score") or 0
                    ) or None
                except (TypeError, ValueError):
                    rating = None
                name = (
                    item.get("author")
                    or item.get("reviewer_name")
                    or item.get("user_id")
                    or ""
                ).strip()
                reviews.append({
                    "text":   text,
                    "rating": rating,
                    "author": name or None,
                })
                if len(reviews) >= _MAX_REVIEWS:
                    return reviews

        # Raw HTML fallback for Amazon
        elif isinstance(content, str):
            text_matches = re.findall(
                r'data-hook="review-body"[^>]*>.*?<span[^>]*>([^<]{20,})</span>',
                content,
                re.DOTALL,
            )
            rating_matches = re.findall(
                r'data-hook="review-star-rating"[^>]*>\s*<span[^>]*>([\d.]+) out',
                content,
            )
            name_matches = re.findall(
                r'data-hook="genome-widget"[^>]*>.*?<span[^>]*>([^<]+)</span>',
                content,
                re.DOTALL,
            )
            for i, text in enumerate(text_matches[:_MAX_REVIEWS]):
                try:
                    r = float(rating_matches[i]) if i < len(rating_matches) else None
                except (ValueError, TypeError):
                    r = None
                n = name_matches[i].strip() if i < len(name_matches) else None
                reviews.append({
                    "text":   re.sub(r"\s+", " ", text).strip(),
                    "rating": r,
                    "author": n,
                })

        if len(reviews) >= _MAX_REVIEWS:
            break

    return reviews[:_MAX_REVIEWS]


# ── Public API ────────────────────────────────────────────────────────────────

async def fetch_reviews(product_url: str) -> dict[str, Any]:
    """
    Fetch genuine customer reviews for a Flipkart or Amazon product URL
    using the Oxylabs Web API with Bearer Token authentication.

    Returns
    -------
    {
        "success":  bool,
        "source":   "flipkart" | "amazon" | "unknown",
        "reviews":  [ { "text": str, "rating": float|None, "author": str|None } ],
        "count":    int,
        "error":    str | None,
    }
    """
    lower = product_url.lower()
    is_amazon   = "amazon.in" in lower or "amazon.com" in lower
    is_flipkart = "flipkart.com" in lower
    source_label = "amazon" if is_amazon else ("flipkart" if is_flipkart else "unknown")

    if not (is_amazon or is_flipkart):
        return {
            "success": False,
            "source":  source_label,
            "reviews": [],
            "count":   0,
            "error":   "Only Flipkart and Amazon India product URLs are supported.",
        }

    try:
        api_key = _get_api_key()
    except ValueError as exc:
        return {
            "success": False,
            "source":  source_label,
            "reviews": [],
            "count":   0,
            "error":   str(exc),
        }

    scrape_url   = _reviews_url_for(product_url)
    oxylabs_src  = _detect_source(product_url)

    payload: dict[str, Any] = {
        "source":  oxylabs_src,
        "url":     scrape_url,
        "geo_location": "India",
        "render":  "html",
        "parse":   True,
    }

    headers: dict[str, str] = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type":  "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=_TIMEOUT_S) as client:
            resp = await client.post(
                _OXYLABS_API,
                json=payload,
                headers=headers,
            )
    except httpx.TimeoutException:
        return {
            "success": False,
            "source":  source_label,
            "reviews": [],
            "count":   0,
            "error":   "Oxylabs request timed out. Try again shortly.",
        }
    except httpx.RequestError as exc:
        return {
            "success": False,
            "source":  source_label,
            "reviews": [],
            "count":   0,
            "error":   f"Network error reaching Oxylabs: {exc}",
        }

    if resp.status_code == 401:
        return {
            "success": False,
            "source":  source_label,
            "reviews": [],
            "count":   0,
            "error":   "Oxylabs authentication failed. Check OXYLABS_API_KEY.",
        }

    if resp.status_code != 200:
        return {
            "success": False,
            "source":  source_label,
            "reviews": [],
            "count":   0,
            "error":   f"Oxylabs returned HTTP {resp.status_code}: {resp.text[:300]}",
        }

    try:
        body = resp.json()
    except Exception:
        return {
            "success": False,
            "source":  source_label,
            "reviews": [],
            "count":   0,
            "error":   "Could not parse Oxylabs response as JSON.",
        }

    results = body.get("results") or []

    if is_amazon:
        reviews = _parse_amazon_reviews(results)
    else:
        reviews = _parse_flipkart_reviews(results)

    return {
        "success": True,
        "source":  source_label,
        "reviews": reviews,
        "count":   len(reviews),
        "error":   None,
    }
