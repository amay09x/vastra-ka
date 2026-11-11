-- ============================================================================
-- VASTRA SQL Queries & Database Objects (Azure SQL / T-SQL)
-- Includes: Complex JOINs, Aggregation VIEWs, Stored Procedures, and ACID Transactions
-- ============================================================================

-- ============================================================================
-- 1. COMPLEX MULTI-TABLE JOINS
-- ============================================================================

-- Query 1.1: Fetch user's wishlist enriched with product pricing, discount %,
-- review counts, and average star ratings via LEFT JOINs.
SELECT 
    u.id AS user_id,
    u.email AS user_email,
    u.display_name AS user_name,
    p.id AS product_id,
    p.title AS product_title,
    p.brand AS product_brand,
    p.category AS product_category,
    p.price AS current_price,
    p.original_price AS original_price,
    CASE 
        WHEN p.original_price > 0 AND p.original_price > p.price 
        THEN ROUND(((p.original_price - p.price) / p.original_price) * 100.0, 1)
        ELSE 0.0 
    END AS discount_percentage,
    p.product_url,
    p.thumbnail_url,
    w.notes AS wishlist_note,
    w.created_at AS added_to_wishlist_at,
    ISNULL(review_stats.avg_rating, 0.0) AS average_rating,
    ISNULL(review_stats.total_reviews, 0) AS total_reviews
FROM dbo.users u
INNER JOIN dbo.wishlist w 
    ON u.id = w.user_id
INNER JOIN dbo.products p 
    ON w.product_id = p.id
LEFT JOIN (
    SELECT 
        product_id,
        ROUND(AVG(CAST(rating AS FLOAT)), 1) AS avg_rating,
        COUNT(id) AS total_reviews
    FROM dbo.reviews
    GROUP BY product_id
) review_stats 
    ON p.id = review_stats.product_id
WHERE u.firebase_uid = 'firebase_sample_uid_123'
ORDER BY w.created_at DESC;

-- Query 1.2: Audit Trail Join — Correlate search and vision uploads with user details
SELECT 
    a.id AS log_id,
    u.email,
    u.role AS user_role,
    a.action_type,
    a.query_text,
    a.blob_image_url,
    p.title AS referenced_product_title,
    a.ip_address,
    a.created_at AS event_timestamp
FROM dbo.activity_logs a
INNER JOIN dbo.users u 
    ON a.user_id = u.id
LEFT JOIN dbo.products p 
    ON a.product_id = p.id
WHERE a.created_at >= DATEADD(day, -7, SYSDATETIMEOFFSET())
ORDER BY a.created_at DESC;

GO

-- ============================================================================
-- 2. DATABASE VIEWS
-- ============================================================================

-- View 2.1: Product Performance & Engagement Summary View
-- Computes real-time engagement metrics per product for merchandising dashboards.
IF OBJECT_ID('dbo.vw_ProductAnalyticsSummary', 'V') IS NOT NULL
    DROP VIEW dbo.vw_ProductAnalyticsSummary;
GO

CREATE VIEW dbo.vw_ProductAnalyticsSummary AS
SELECT 
    p.id AS product_id,
    p.external_product_id,
    p.title,
    p.brand,
    p.category,
    p.price,
    p.original_price,
    p.currency,
    p.source AS retailer,
    -- Aggregate wishlist saves
    COUNT(DISTINCT w.id) AS wishlist_save_count,
    -- Aggregate reviews and ratings
    COUNT(DISTINCT r.id) AS total_review_count,
    ISNULL(ROUND(AVG(CAST(r.rating AS FLOAT)), 2), 0.0) AS average_rating,
    SUM(CASE WHEN r.is_verified_purchase = 1 THEN 1 ELSE 0 END) AS verified_review_count,
    -- Aggregate user interactions from audit logs
    COUNT(DISTINCT a.id) AS total_interactions,
    MAX(r.created_at) AS latest_review_at
FROM dbo.products p
LEFT JOIN dbo.wishlist w 
    ON p.id = w.product_id
LEFT JOIN dbo.reviews r 
    ON p.id = r.product_id
LEFT JOIN dbo.activity_logs a 
    ON p.id = a.product_id
GROUP BY 
    p.id,
    p.external_product_id,
    p.title,
    p.brand,
    p.category,
    p.price,
    p.original_price,
    p.currency,
    p.source;
GO

-- ============================================================================
-- 3. STORED PROCEDURE
-- ============================================================================

-- Stored Procedure: sp_UpsertProductReview
-- Safely inserts or updates a product review by an authenticated user,
-- enforcing constraints and automatically auditing the event in activity_logs.
IF OBJECT_ID('dbo.sp_UpsertProductReview', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_UpsertProductReview;
GO

CREATE PROCEDURE dbo.sp_UpsertProductReview
    @FirebaseUID        VARCHAR(128),
    @ExternalProductID  VARCHAR(128),
    @Rating             NUMERIC(2, 1),
    @Title              VARCHAR(200) = NULL,
    @Comment            NVARCHAR(MAX) = NULL,
    @IsVerifiedPurchase BIT = 0,
    @IPAddress          VARCHAR(45) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    -- Validate rating bounds
    IF @Rating < 1.0 OR @Rating > 5.0
    BEGIN
        RAISERROR('Rating must be between 1.0 and 5.0.', 16, 1);
        RETURN -1;
    END

    DECLARE @UserID INT;
    DECLARE @ProductID INT;

    -- Resolve User ID
    SELECT @UserID = id FROM dbo.users WHERE firebase_uid = @FirebaseUID;
    IF @UserID IS NULL
    BEGIN
        RAISERROR('User with specified Firebase UID does not exist.', 16, 1);
        RETURN -2;
    END

    -- Resolve Product ID
    SELECT @ProductID = id FROM dbo.products WHERE external_product_id = @ExternalProductID;
    IF @ProductID IS NULL
    BEGIN
        RAISERROR('Product with specified external ID does not exist.', 16, 1);
        RETURN -3;
    END

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Upsert review (Insert if new, Update if already exists)
        IF EXISTS (SELECT 1 FROM dbo.reviews WHERE user_id = @UserID AND product_id = @ProductID)
        BEGIN
            UPDATE dbo.reviews
            SET 
                rating = @Rating,
                title = @Title,
                comment = @Comment,
                is_verified_purchase = @IsVerifiedPurchase,
                updated_at = SYSDATETIMEOFFSET()
            WHERE user_id = @UserID AND product_id = @ProductID;
        END
        ELSE
        BEGIN
            INSERT INTO dbo.reviews (
                user_id,
                product_id,
                rating,
                title,
                comment,
                is_verified_purchase,
                created_at,
                updated_at
            ) VALUES (
                @UserID,
                @ProductID,
                @Rating,
                @Title,
                @Comment,
                @IsVerifiedPurchase,
                SYSDATETIMEOFFSET(),
                SYSDATETIMEOFFSET()
            );
        END

        -- Audit the action in activity_logs
        INSERT INTO dbo.activity_logs (
            user_id,
            product_id,
            action_type,
            query_text,
            ip_address,
            created_at
        ) VALUES (
            @UserID,
            @ProductID,
            'submit_review',
            CONCAT('Rating: ', @Rating, ' | Title: ', ISNULL(@Title, 'N/A')),
            @IPAddress,
            SYSDATETIMEOFFSET()
        );

        COMMIT TRANSACTION;
        SELECT 1 AS success, 'Review successfully submitted and audited.' AS message;
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
        RETURN -99;
    END CATCH
END;
GO

-- ============================================================================
-- 4. ACID TRANSACTION
-- ============================================================================

-- Atomic Transaction: Save item to Wishlist and log telemetry event.
-- If any part fails (e.g. invalid user or foreign key violation), the entire
-- transaction rolls back, preserving database consistency.

DECLARE @TargetUserUID      VARCHAR(128) = 'firebase_sample_uid_123';
DECLARE @TargetExternalID   VARCHAR(128) = 'zara_linen_shirt_001';
DECLARE @WishlistNote       VARCHAR(500) = 'Must buy for summer casual look';
DECLARE @UserClientIP       VARCHAR(45)  = '103.21.244.2';

DECLARE @ResolvedUserID     INT;
DECLARE @ResolvedProductID  INT;

SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    -- Step 1: Look up user and product surrogate keys
    SELECT @ResolvedUserID = id FROM dbo.users WHERE firebase_uid = @TargetUserUID;
    SELECT @ResolvedProductID = id FROM dbo.products WHERE external_product_id = @TargetExternalID;

    IF @ResolvedUserID IS NULL OR @ResolvedProductID IS NULL
    BEGIN
        THROW 50001, 'User or Product lookup failed. Transaction aborted.', 1;
    END

    -- Step 2: Ensure item is not already in wishlist, then insert
    IF NOT EXISTS (
        SELECT 1 FROM dbo.wishlist 
        WHERE user_id = @ResolvedUserID AND product_id = @ResolvedProductID
    )
    BEGIN
        INSERT INTO dbo.wishlist (user_id, product_id, notes, created_at)
        VALUES (@ResolvedUserID, @ResolvedProductID, @WishlistNote, SYSDATETIMEOFFSET());
    END
    ELSE
    BEGIN
        UPDATE dbo.wishlist 
        SET notes = @WishlistNote, created_at = SYSDATETIMEOFFSET()
        WHERE user_id = @ResolvedUserID AND product_id = @ResolvedProductID;
    END

    -- Step 3: Record the action atomically in activity_logs
    INSERT INTO dbo.activity_logs (
        user_id,
        product_id,
        action_type,
        query_text,
        ip_address,
        created_at
    )
    VALUES (
        @ResolvedUserID,
        @ResolvedProductID,
        'add_wishlist',
        CONCAT('Saved product ID: ', @ResolvedProductID),
        @UserClientIP,
        SYSDATETIMEOFFSET()
    );

    COMMIT TRANSACTION;
    PRINT 'Transaction committed successfully: Wishlist item and activity log recorded.';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    PRINT 'Transaction rolled back due to error: ' + ERROR_MESSAGE();
    THROW;
END CATCH;
GO

