"""
backend/app/models/schema.py
============================
Third Normal Form (3NF) relational schema for VASTRA on Azure SQL Database.

Tables
------
1. Users        — Core authenticated accounts (mapped to Firebase UID + RBAC role)
2. Products     — Normalized fashion product catalog entries
3. Wishlist     — Junction table resolving the M:N relationship (Users <-> Products)
4. Reviews      — User-authored ratings and reviews for products
5. ActivityLogs — Auditable user interaction and search history events

3NF Design Guarantees
---------------------
- 1NF: Every column stores a single atomic value; every table has a primary key.
- 2NF: Single-column surrogate primary keys eliminate partial dependencies;
       composite uniqueness (e.g., user + product) is enforced via constraints.
- 3NF: No transitive dependencies—derived aggregates (such as average rating)
       and parent attributes (such as product titles or user emails) are never
       duplicated across child tables.
"""

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import false, func, true

from app.database import Base


class Users(Base):
    """Registered VASTRA user accounts linked to Firebase Authentication."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    firebase_uid = Column(String(128), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    display_name = Column(String(150), nullable=True)
    role = Column(String(50), nullable=False, server_default="user", default="user")
    is_active = Column(Boolean, nullable=False, server_default=true(), default=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    wishlist_items = relationship(
        "Wishlist", back_populates="user", cascade="all, delete-orphan"
    )
    reviews = relationship(
        "Reviews", back_populates="user", cascade="all, delete-orphan"
    )
    activity_logs = relationship(
        "ActivityLogs", back_populates="user", cascade="all, delete-orphan"
    )


class Products(Base):
    """Normalized catalog of fashion products surfaced by VASTRA."""

    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    external_product_id = Column(
        String(128), unique=True, nullable=False, index=True
    )
    title = Column(String(500), nullable=False)
    brand = Column(String(150), nullable=True, index=True)
    category = Column(String(100), nullable=True, index=True)
    source = Column(String(150), nullable=True)
    price = Column(Numeric(10, 2), nullable=True)
    original_price = Column(Numeric(10, 2), nullable=True)
    currency = Column(String(10), nullable=False, server_default="INR", default="INR")
    product_url = Column(Text, nullable=True)
    thumbnail_url = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    wishlist_entries = relationship(
        "Wishlist", back_populates="product", cascade="all, delete-orphan"
    )
    reviews = relationship(
        "Reviews", back_populates="product", cascade="all, delete-orphan"
    )
    activity_logs = relationship("ActivityLogs", back_populates="product")


class Wishlist(Base):
    """Junction table connecting Users and saved Products (3NF M:N mapping)."""

    __tablename__ = "wishlist"
    __table_args__ = (
        UniqueConstraint("user_id", "product_id", name="uq_wishlist_user_product"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id = Column(
        Integer,
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    notes = Column(String(500), nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    user = relationship("Users", back_populates="wishlist_items")
    product = relationship("Products", back_populates="wishlist_entries")


class Reviews(Base):
    """Customer product reviews authored by authenticated Users."""

    __tablename__ = "reviews"
    __table_args__ = (
        UniqueConstraint("user_id", "product_id", name="uq_reviews_user_product"),
        CheckConstraint(
            "rating >= 1.0 AND rating <= 5.0", name="ck_reviews_rating_range"
        ),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id = Column(
        Integer,
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    rating = Column(Numeric(2, 1), nullable=False)
    title = Column(String(200), nullable=True)
    comment = Column(Text, nullable=True)
    is_verified_purchase = Column(
        Boolean, nullable=False, server_default=false(), default=False
    )
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user = relationship("Users", back_populates="reviews")
    product = relationship("Products", back_populates="reviews")


class ActivityLogs(Base):
    """Audit trail of user interactions, searches, and visual uploads."""

    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id = Column(
        Integer,
        ForeignKey("products.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    action_type = Column(String(100), nullable=False, index=True)
    query_text = Column(String(500), nullable=True)
    blob_image_url = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )

    user = relationship("Users", back_populates="activity_logs")
    product = relationship("Products", back_populates="activity_logs")

