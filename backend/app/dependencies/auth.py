"""
backend/app/dependencies/auth.py
=================================
FastAPI dependency that verifies a Firebase ID token sent by the frontend.

Usage
-----
Add `user: dict = Depends(get_current_user)` to any route that requires
authentication. For RBAC, also add `Depends(require_role("admin"))`.

How it works
------------
1. The frontend calls `user.getIdToken()` and places the JWT in the
   Authorization header:  "Authorization: Bearer <id_token>"
2. This dependency extracts the token and calls the Firebase REST
   tokenInfo endpoint to verify it without installing the Firebase Admin SDK.
   (For production, replace with firebase-admin for offline verification.)
3. The decoded token claims are returned to the route handler.

Environment
-----------
FIREBASE_PROJECT_ID  — Your Firebase project ID (required).
                       Set in backend/.env or the host environment.
"""

import os
from typing import Annotated

import httpx
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

load_dotenv()

# ── Bearer scheme ─────────────────────────────────────────────────────────────

_bearer_scheme = HTTPBearer(
    scheme_name="Firebase JWT",
    description="Firebase ID token obtained from `user.getIdToken()`",
    auto_error=True,         # raises 403 when no token is present
)

# ── Google token-info endpoint (online verification) ──────────────────────────
# This calls Google's public endpoint and returns the decoded claims.
# Fine for development; switch to firebase-admin for offline production use.

_GOOGLE_TOKEN_INFO_URL = (
    "https://www.googleapis.com/oauth2/v3/tokeninfo"
)

_FIREBASE_JWT_ISSUER_PREFIX = "https://securetoken.google.com/"


def _get_project_id() -> str:
    project_id = os.getenv("FIREBASE_PROJECT_ID", "").strip()
    if not project_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "FIREBASE_PROJECT_ID is not set in backend/.env. "
                "Authentication is unavailable."
            ),
        )
    return project_id


# ── Core verification dependency ──────────────────────────────────────────────

async def get_current_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials,
        Security(_bearer_scheme),
    ],
) -> dict:
    """
    Verify the Firebase ID token and return the decoded token claims.

    Raises HTTP 401 if the token is missing, expired, or invalid.
    """
    id_token = credentials.credentials
    project_id = _get_project_id()

    # ── Call Google's token-info endpoint ──────────────────────────────────
    # Google validates the JWT signature, expiry, and audience for us.
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                _GOOGLE_TOKEN_INFO_URL,
                params={"id_token": id_token},
            )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Could not reach Google token verification service: {exc}",
        )

    if resp.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase ID token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    claims: dict = resp.json()

    # ── Validate issuer (must be THIS project) ─────────────────────────────
    expected_issuer = f"{_FIREBASE_JWT_ISSUER_PREFIX}{project_id}"
    if claims.get("iss") != expected_issuer:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token issuer mismatch.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # ── Validate audience ──────────────────────────────────────────────────
    if claims.get("aud") != project_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token audience mismatch.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return claims   # keys: sub, email, name, picture, email_verified, ...


# ── RBAC helper ───────────────────────────────────────────────────────────────

def require_role(role: str):
    """
    Factory that returns a FastAPI dependency enforcing a specific custom-claim
    role set via Firebase Admin (e.g., `auth.set_custom_user_claims`).

    Usage in a route:
        @router.get("/admin-only")
        async def admin_route(user=Depends(require_role("admin"))):
            ...

    Supported roles in this codebase
    ---------------------------------
    "admin"   — full backend access
    "user"    — standard authenticated user (default)
    "premium" — paid subscriber features

    Note: Custom claims are set server-side via firebase-admin and are
    present in `claims["role"]`.  New users will have no "role" claim;
    treat them as "user" by default.
    """

    async def _check_role(
        claims: Annotated[dict, Depends(get_current_user)],
    ) -> dict:
        user_role = claims.get("role", "user")  # default to "user"

        # Simple hierarchy: admin > premium > user
        ROLE_RANK = {"user": 1, "premium": 2, "admin": 3}
        required_rank = ROLE_RANK.get(role, 1)
        actual_rank   = ROLE_RANK.get(user_role, 1)

        if actual_rank < required_rank:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"This endpoint requires the '{role}' role. "
                    f"Your account role is '{user_role}'."
                ),
            )

        return claims

    return _check_role

