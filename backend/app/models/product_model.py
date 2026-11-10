from pydantic import BaseModel, Field


class CustomerReview(BaseModel):
    # Customer review details
    title: str | None = None
    text: str
    rating: float | None = None
    reviewer: str | None = None
    verified_buyer: bool | None = None


class Product(BaseModel):
    # Product Info
    product_id: str | None = None
    immersive_api: str | None = None
    title: str | None = None
    source: str | None = None
    brand: str | None = None
    product_link: str | None = None
    thumbnail: str | None = None
    images: list = Field(default_factory=list)

    # Pricing
    price: str | None = None
    original_price: str | None = None
    extracted_price: float | None = None
    extracted_original_price: float | None = None

    # Ratings / Reviews
    rating: float | None = None
    review_count: int | None = None
    customer_reviews: list[CustomerReview] = Field(default_factory=list)

    # Merchants
    merchants: list = Field(default_factory=list)
    buy_now: dict | None = None
    available_on: list = Field(default_factory=list)

    # Additional product data
    description: str | None = None
    features: list = Field(default_factory=list)
    extensions: list = Field(default_factory=list)

    # VASTRA Recommendation Engine
    score: int = 0
    value_score: int = 0
    trend_score: int = 0
    score_breakdown: dict = Field(default_factory=dict)
    why_recommended: list = Field(default_factory=list)
    rank: int | None = None
    ai_pick: bool = False
    ai_review: dict | None = None
