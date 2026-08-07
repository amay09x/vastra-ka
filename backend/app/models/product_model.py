from pydantic import BaseModel, Field


class Product(BaseModel):

    # -----------------------------
    # Product Info
    # -----------------------------

    product_id: str | None = None
    immersive_api: str | None = None

    title: str | None = None

    thumbnail: str | None = None

    images: list = Field(default_factory=list)

    # -----------------------------
    # Pricing
    # -----------------------------

    price: str | None = None

    # -----------------------------
    # Ratings
    # -----------------------------

    rating: float | None = None

    review_count: int | None = None

    customer_reviews: list = Field(default_factory=list)

    # -----------------------------
    # Merchants
    # -----------------------------

    merchants: list = Field(default_factory=list)

    buy_now: dict | None = None

    available_on: list = Field(default_factory=list)

    # -----------------------------
    # DressAI Recommendation Engine
    # -----------------------------

    score: int = 0

    value_score: int = 0

    trend_score: int = 0

    score_breakdown: dict = Field(default_factory=dict)

    why_recommended: list = Field(default_factory=list)

    rank: int | None = None

    ai_pick: bool = False

    ai_review: dict | None = None