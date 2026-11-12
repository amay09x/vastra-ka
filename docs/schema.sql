-- ============================================================================
-- VASTRA Database Schema (Azure SQL / T-SQL)
-- Third Normal Form (3NF) Relational Architecture
-- Models mirrored from backend/app/models/schema.py
-- ============================================================================

-- Drop tables in reverse foreign-key order if resetting
IF OBJECT_ID('dbo.activity_logs', 'U') IS NOT NULL DROP TABLE dbo.activity_logs;
IF OBJECT_ID('dbo.reviews', 'U') IS NOT NULL DROP TABLE dbo.reviews;
IF OBJECT_ID('dbo.wishlist', 'U') IS NOT NULL DROP TABLE dbo.wishlist;
IF OBJECT_ID('dbo.products', 'U') IS NOT NULL DROP TABLE dbo.products;
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE dbo.users;

-- ============================================================================
-- 1. USERS TABLE
-- Authentication and RBAC profile data linked to Firebase UID
-- ============================================================================
CREATE TABLE dbo.users (
    id              INT IDENTITY(1,1)   NOT NULL,
    firebase_uid    VARCHAR(128)        NOT NULL,
    email           VARCHAR(255)        NOT NULL,
    display_name    VARCHAR(150)        NULL,
    role            VARCHAR(50)         NOT NULL CONSTRAINT DF_users_role DEFAULT 'user',
    is_active       BIT                 NOT NULL CONSTRAINT DF_users_is_active DEFAULT 1,
    created_at      DATETIMEOFFSET      NOT NULL CONSTRAINT DF_users_created_at DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIMEOFFSET      NOT NULL CONSTRAINT DF_users_updated_at DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT PK_users PRIMARY KEY CLUSTERED (id),
    CONSTRAINT UQ_users_firebase_uid UNIQUE NONCLUSTERED (firebase_uid),
    CONSTRAINT UQ_users_email UNIQUE NONCLUSTERED (email)
);

CREATE NONCLUSTERED INDEX IX_users_firebase_uid ON dbo.users (firebase_uid);
CREATE NONCLUSTERED INDEX IX_users_email ON dbo.users (email);

-- ============================================================================
-- 2. PRODUCTS TABLE
-- Canonical catalog items discovered across retailers (Flipkart, Amazon, etc.)
-- ============================================================================
CREATE TABLE dbo.products (
    id                  INT IDENTITY(1,1)   NOT NULL,
    external_product_id VARCHAR(128)        NOT NULL,
    title               VARCHAR(500)        NOT NULL,
    brand               VARCHAR(150)        NULL,
    category            VARCHAR(100)        NULL,
    source              VARCHAR(150)        NULL,
    price               NUMERIC(10, 2)      NULL,
    original_price      NUMERIC(10, 2)      NULL,
    currency            VARCHAR(10)         NOT NULL CONSTRAINT DF_products_currency DEFAULT 'INR',
    product_url         NVARCHAR(MAX)       NULL,
    thumbnail_url       NVARCHAR(MAX)       NULL,
    description         NVARCHAR(MAX)       NULL,
    created_at          DATETIMEOFFSET      NOT NULL CONSTRAINT DF_products_created_at DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT PK_products PRIMARY KEY CLUSTERED (id),
    CONSTRAINT UQ_products_external_id UNIQUE NONCLUSTERED (external_product_id)
);

CREATE NONCLUSTERED INDEX IX_products_external_id ON dbo.products (external_product_id);
CREATE NONCLUSTERED INDEX IX_products_brand ON dbo.products (brand);
CREATE NONCLUSTERED INDEX IX_products_category ON dbo.products (category);

-- ============================================================================
-- 3. WISHLIST TABLE
-- Junction table resolving Many-to-Many relationship between Users and Products
-- ============================================================================
CREATE TABLE dbo.wishlist (
    id          INT IDENTITY(1,1)   NOT NULL,
    user_id     INT                 NOT NULL,
    product_id  INT                 NOT NULL,
    notes       VARCHAR(500)        NULL,
    created_at  DATETIMEOFFSET      NOT NULL CONSTRAINT DF_wishlist_created_at DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT PK_wishlist PRIMARY KEY CLUSTERED (id),
    CONSTRAINT UQ_wishlist_user_product UNIQUE NONCLUSTERED (user_id, product_id),
    CONSTRAINT FK_wishlist_users FOREIGN KEY (user_id) 
        REFERENCES dbo.users (id) ON DELETE CASCADE,
    CONSTRAINT FK_wishlist_products FOREIGN KEY (product_id) 
        REFERENCES dbo.products (id) ON DELETE CASCADE
);

CREATE NONCLUSTERED INDEX IX_wishlist_user_id ON dbo.wishlist (user_id);
CREATE NONCLUSTERED INDEX IX_wishlist_product_id ON dbo.wishlist (product_id);

-- ============================================================================
-- 4. REVIEWS TABLE
-- Authenticated user ratings and customer feedback on catalog items
-- ============================================================================
CREATE TABLE dbo.reviews (
    id                      INT IDENTITY(1,1)   NOT NULL,
    user_id                 INT                 NOT NULL,
    product_id              INT                 NOT NULL,
    rating                  NUMERIC(2, 1)       NOT NULL,
    title                   VARCHAR(200)        NULL,
    comment                 NVARCHAR(MAX)       NULL,
    is_verified_purchase    BIT                 NOT NULL CONSTRAINT DF_reviews_is_verified DEFAULT 0,
    created_at              DATETIMEOFFSET      NOT NULL CONSTRAINT DF_reviews_created_at DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIMEOFFSET      NOT NULL CONSTRAINT DF_reviews_updated_at DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT PK_reviews PRIMARY KEY CLUSTERED (id),
    CONSTRAINT UQ_reviews_user_product UNIQUE NONCLUSTERED (user_id, product_id),
    CONSTRAINT CK_reviews_rating_range CHECK (rating >= 1.0 AND rating <= 5.0),
    CONSTRAINT FK_reviews_users FOREIGN KEY (user_id) 
        REFERENCES dbo.users (id) ON DELETE CASCADE,
    CONSTRAINT FK_reviews_products FOREIGN KEY (product_id) 
        REFERENCES dbo.products (id) ON DELETE CASCADE
);

CREATE NONCLUSTERED INDEX IX_reviews_user_id ON dbo.reviews (user_id);
CREATE NONCLUSTERED INDEX IX_reviews_product_id ON dbo.reviews (product_id);

-- ============================================================================
-- 5. ACTIVITY_LOGS TABLE
-- Audit log and user telemetry (search, image search, click events)
-- ============================================================================
CREATE TABLE dbo.activity_logs (
    id              INT IDENTITY(1,1)   NOT NULL,
    user_id         INT                 NOT NULL,
    product_id      INT                 NULL,
    action_type     VARCHAR(100)        NOT NULL,
    query_text      VARCHAR(500)        NULL,
    blob_image_url  NVARCHAR(MAX)       NULL,
    ip_address      VARCHAR(45)         NULL,
    created_at      DATETIMEOFFSET      NOT NULL CONSTRAINT DF_activity_logs_created_at DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT PK_activity_logs PRIMARY KEY CLUSTERED (id),
    CONSTRAINT FK_activity_logs_users FOREIGN KEY (user_id) 
        REFERENCES dbo.users (id) ON DELETE CASCADE,
    CONSTRAINT FK_activity_logs_products FOREIGN KEY (product_id) 
        REFERENCES dbo.products (id) ON DELETE SET NULL
);

CREATE NONCLUSTERED INDEX IX_activity_logs_user_id ON dbo.activity_logs (user_id);
CREATE NONCLUSTERED INDEX IX_activity_logs_product_id ON dbo.activity_logs (product_id);
CREATE NONCLUSTERED INDEX IX_activity_logs_action_type ON dbo.activity_logs (action_type);
CREATE NONCLUSTERED INDEX IX_activity_logs_created_at ON dbo.activity_logs (created_at);

