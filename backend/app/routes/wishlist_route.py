"""
backend/app/routes/wishlist_route.py
======================================
Protected wishlist endpoint — demonstrates Firebase-based RBAC.

All routes here require a valid Firebase ID token.
The /wishlist/admin route additionally requires the "admin" custom claim.
"""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user, require_role

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


# ── GET /wishlist ─────────────────────────────────────────────────────────────
# Any authenticated user can access their wishlist.

@router.get("")
async def get_wishlist(
    user: Annotated[dict, Depends(get_current_user)],
):
    """
    Returns the authenticated user's wishlist.

    Requires: valid Firebase ID token (any role).
    """
    return {
        "success": True,
        "user": {
            "uid":   user.get("sub"),
            "email": user.get("email"),
            "role":  user.get("role", "user"),
        },
        # Placeholder wishlist — replace with real DB query
        "wishlist": [
            {
                "product_id": "demo-001",
                "title": "Black Oversized Linen Shirt",
                "brand": "ZARA",
                "price": "₹2,199",
                "added_at": "2026-11-01",
            },
            {
                "product_id": "demo-002",
                "title": "Relaxed Fit Cotton Tee",
                "brand": "H&M",
                "price": "₹999",
                "added_at": "2026-11-03",
            },
        ],
    }


# ── POST /wishlist/add ────────────────────────────────────────────────────────
# Any authenticated user can add items. (requires "user" role or above)

@router.post("/add")
async def add_to_wishlist(
    product_id: str,
    user: Annotated[dict, Depends(require_role("user"))],
):
    """
    Adds a product to the user's wishlist.

    Requires: authenticated user with at least the "user" role.
    """
    return {
        "success": True,
        "message": f"Product '{product_id}' added to wishlist.",
        "user_uid": user.get("sub"),
    }


# ── GET /wishlist/admin ───────────────────────────────────────────────────────
# Only "admin" role users can see all wishlists — demonstrates RBAC enforcement.

@router.get("/admin")
async def admin_all_wishlists(
    user: Annotated[dict, Depends(require_role("admin"))],
):
    """
    Returns all users' wishlists for admin review.

    Requires: authenticated user with the "admin" custom claim.
    Returns HTTP 403 for non-admin users.
    """
    return {
        "success": True,
        "admin_email": user.get("email"),
        "message": (
            "RBAC check passed — this response is visible to admins only."
        ),
        "all_wishlists": [],   # Replace with real DB aggregation
    }

