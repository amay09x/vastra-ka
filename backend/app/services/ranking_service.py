import math
import re


class RankingService:
    """
    Deterministic VASTRA product ranking.

    The score is calculated from the information available in the
    initial Google Shopping result, so it does NOT depend on the
    expensive merchant lookup that now happens only on the detail page.

    Overall score = 100 points:
        relevance   25
        rating      15
        reviews     10
        budget      20
        style       15
        trend       10
        data        5

    The individual sub-scores are also exposed as:
        product.value_score
        product.trend_score
        product.score_breakdown
        product.why_recommended
    """

    # ------------------------------------------------------------
    # BASIC HELPERS
    # ------------------------------------------------------------

    @staticmethod
    def _text(value):
        if value is None:
            return ""
        return str(value).strip().lower()

    @staticmethod
    def _number(value):
        if value is None or value == "":
            return None

        if isinstance(value, (int, float)):
            return float(value)

        text = str(value).lower().replace(",", "")

        # ₹1,299 / Rs 1299 / 1299
        match = re.search(r"(\d+(?:\.\d+)?)", text)

        if not match:
            return None

        try:
            return float(match.group(1))
        except ValueError:
            return None

    @staticmethod
    def _review_count(value):
        if value is None or value == "":
            return 0

        if isinstance(value, (int, float)):
            return max(int(value), 0)

        text = str(value).lower().replace(",", "").strip()

        match = re.search(r"(\d+(?:\.\d+)?)\s*k", text)

        if match:
            try:
                return max(
                    int(float(match.group(1)) * 1000),
                    0,
                )
            except ValueError:
                return 0

        match = re.search(r"(\d+)", text)

        if not match:
            return 0

        try:
            return max(int(match.group(1)), 0)
        except ValueError:
            return 0

    @staticmethod
    def _tokens(value):
        text = RankingService._text(value)

        if not text:
            return set()

        return {
            token
            for token in re.findall(r"[a-z0-9]+", text)
            if len(token) >= 2
        }

    # ------------------------------------------------------------
    # REQUEST SIGNALS
    # ------------------------------------------------------------

    @staticmethod
    def _category_terms(category):
        category = RankingService._text(category)

        aliases = {
            "shirt": {
                "shirt",
                "shirts",
                "formal",
                "casual",
                "button",
                "collar",
            },
            "t-shirt": {
                "tshirt",
                "tshirts",
                "tee",
                "tees",
                "t",
            },
            "top": {
                "top",
                "tops",
                "blouse",
                "camisole",
            },
            "hoodie": {
                "hoodie",
                "hoodies",
                "hooded",
            },
            "sweatshirt": {
                "sweatshirt",
                "sweatshirts",
                "crewneck",
                "sweat",
            },
            "blazer": {
                "blazer",
                "blazers",
                "sportcoat",
            },
            "jacket": {
                "jacket",
                "jackets",
                "outerwear",
            },
            "jeans": {
                "jeans",
                "denim",
            },
            "pants": {
                "pants",
                "trousers",
                "chinos",
                "joggers",
                "cargo",
                "bottom",
            },
            "shorts": {
                "shorts",
            },
            "dress": {
                "dress",
                "dresses",
            },
            "skirt": {
                "skirt",
                "skirts",
            },
            "kurta": {
                "kurta",
                "kurtas",
                "kurti",
                "kurtis",
            },
            "saree": {
                "saree",
                "sarees",
            },
            "lehenga": {
                "lehenga",
                "lehengas",
            },
            "shoes": {
                "shoe",
                "shoes",
                "sneaker",
                "sneakers",
                "loafer",
                "loafers",
                "boot",
                "boots",
                "sandal",
                "sandals",
            },
        }

        return aliases.get(
            category,
            RankingService._tokens(category),
        )

    @staticmethod
    def _match_ratio(title, terms):
        if not terms:
            return 0.0

        title_tokens = RankingService._tokens(title)

        if not title_tokens:
            return 0.0

        matched = len(title_tokens.intersection(terms))

        return min(matched / max(len(terms), 1), 1.0)

    @staticmethod
    def _keyword_presence(title, value):
        value_text = RankingService._text(value)

        if not value_text:
            return 0.0

        title_text = RankingService._text(title)

        if not title_text:
            return 0.0

        # Phrase match is stronger than a partial token match.
        if value_text in title_text:
            return 1.0

        requested_tokens = RankingService._tokens(value_text)

        if not requested_tokens:
            return 0.0

        title_tokens = RankingService._tokens(title_text)

        matched = len(
            requested_tokens.intersection(title_tokens)
        )

        return min(
            matched / len(requested_tokens),
            1.0,
        )

    # ------------------------------------------------------------
    # BUDGET
    # ------------------------------------------------------------

    @staticmethod
    def _budget_score(price, budget):
        """
        Returns 0-20.

        A cheaper product gets some benefit, but price alone does not
        dominate the ranking. Products very close to the budget remain
        competitive instead of being automatically penalized.
        """

        if budget is None or budget <= 0 or price is None or price <= 0:
            return 12.0

        ratio = price / budget

        if ratio <= 0.50:
            return 20.0

        if ratio <= 0.75:
            return 18.0 - ((ratio - 0.50) / 0.25) * 2.0

        if ratio <= 1.00:
            return 16.0 - ((ratio - 0.75) / 0.25) * 4.0

        if ratio <= 1.10:
            return 12.0 - ((ratio - 1.00) / 0.10) * 4.0

        if ratio <= 1.25:
            return 8.0 - ((ratio - 1.10) / 0.15) * 5.0

        if ratio <= 1.50:
            return 3.0 - ((ratio - 1.25) / 0.25) * 3.0

        return 0.0

    # ------------------------------------------------------------
    # QUALITY
    # ------------------------------------------------------------

    @staticmethod
    def _rating_score(rating):
        if rating is None:
            return 0.0

        rating = max(min(float(rating), 5.0), 0.0)

        # 5.0 rating -> 15 points
        return (rating / 5.0) * 15.0

    @staticmethod
    def _review_score(review_count):
        """
        Log scaling prevents 50,000 reviews from overpowering
        everything else, while still distinguishing products.
        """

        reviews = max(int(review_count or 0), 0)

        if reviews <= 0:
            return 0.0

        normalized = (
            math.log10(reviews + 1) /
            math.log10(1001)
        )

        return min(normalized, 1.0) * 10.0

    # ------------------------------------------------------------
    # STYLE / TREND
    # ------------------------------------------------------------

    @staticmethod
    def _style_score(title, intent):
        """
        0-15.
        Uses explicit style + fit + occasion signals from the request.
        """

        title_text = RankingService._text(title)

        style = RankingService._text(
            (intent or {}).get("style")
        )

        fit = RankingService._text(
            (intent or {}).get("fit")
        )

        occasion = RankingService._text(
            (intent or {}).get("occasion")
        )

        scores = []

        if style:
            scores.append(
                RankingService._keyword_presence(
                    title_text,
                    style,
                )
            )

        if fit:
            scores.append(
                RankingService._keyword_presence(
                    title_text,
                    fit,
                )
            )

        if occasion:
            scores.append(
                RankingService._keyword_presence(
                    title_text,
                    occasion,
                )
            )

        if not scores:
            return 7.5

        return (
            sum(scores) / len(scores)
        ) * 15.0

    @staticmethod
    def _trend_score(title, intent):
        """
        Returns a 0-100 trend score.

        This is intentionally based only on textual product signals,
        because the initial Shopping result does not provide a
        trustworthy universal 'trend' metric.
        """

        title_text = RankingService._text(title)

        style = RankingService._text(
            (intent or {}).get("style")
        )

        style_match = (
            RankingService._keyword_presence(
                title_text,
                style,
            )
            if style
            else 0.50
        )

        trend_terms = {
            "oversized",
            "relaxed",
            "boxy",
            "wide-leg",
            "wideleg",
            "cargo",
            "utility",
            "graphic",
            "textured",
            "textured",
            "striped",
            "printed",
            "minimal",
            "contemporary",
            "streetwear",
            "street",
            "varsity",
            "cropped",
            "baggy",
            "co-ord",
            "coord",
            "layered",
            "premium",
        }

        title_tokens = RankingService._tokens(title_text)

        matched_trend_terms = len(
            title_tokens.intersection(
                {
                    term
                    for term in trend_terms
                    if " " not in term
                }
            )
        )

        trend_keyword_match = min(
            matched_trend_terms / 3.0,
            1.0,
        )

        # 60% request-style fit + 40% product trend signals
        return round(
            (
                style_match * 0.60 +
                trend_keyword_match * 0.40
            ) * 100
        )

    # ------------------------------------------------------------
    # MAIN SCORING
    # ------------------------------------------------------------

    def calculate_score(self, product, intent):
        """
        Calculate a product-specific VASTRA score.

        This method mutates the Product object with all score fields
        so the existing SearchAgent interface continues to work.
        """

        intent = intent or {}

        title = getattr(
            product,
            "title",
            "",
        ) or ""

        price = self._number(
            getattr(product, "price", None)
        )

        rating_raw = getattr(
            product,
            "rating",
            None,
        )

        rating = self._number(rating_raw)

        review_count = self._review_count(
            getattr(
                product,
                "review_count",
                0,
            )
        )

        budget = self._number(
            intent.get("budget")
        )

        # --------------------------------------------------------
        # Relevance: 25
        # --------------------------------------------------------

        category = self._text(
            intent.get("category")
        )

        category_match = (
            self._match_ratio(
                title,
                self._category_terms(category),
            )
            if category
            else 0.65
        )

        color_match = (
            self._keyword_presence(
                title,
                intent.get("color"),
            )
            if intent.get("color")
            else 0.50
        )

        # Stronger when the exact requested type appears.
        relevance_ratio = (
            category_match * 0.70 +
            color_match * 0.30
        )

        relevance_points = (
            relevance_ratio * 25.0
        )

        # --------------------------------------------------------
        # Quality
        # --------------------------------------------------------

        rating_points = self._rating_score(
            rating
        )

        review_points = self._review_score(
            review_count
        )

        # --------------------------------------------------------
        # Budget
        # --------------------------------------------------------

        budget_points = self._budget_score(
            price,
            budget,
        )

        # --------------------------------------------------------
        # Style
        # --------------------------------------------------------

        style_points = self._style_score(
            title,
            intent,
        )

        # --------------------------------------------------------
        # Trend
        # --------------------------------------------------------

        trend_score = self._trend_score(
            title,
            intent,
        )

        trend_points = (
            trend_score / 100.0
        ) * 10.0

        # --------------------------------------------------------
        # Data completeness: 5
        # --------------------------------------------------------

        data_points = 0.0

        if title:
            data_points += 1.0

        if price is not None:
            data_points += 1.0

        if getattr(product, "thumbnail", None):
            data_points += 1.0

        if getattr(product, "product_id", None):
            data_points += 1.0

        if getattr(product, "immersive_api", None):
            data_points += 1.0

        # --------------------------------------------------------
        # OVERALL SCORE
        # --------------------------------------------------------

        total = (
            relevance_points +
            rating_points +
            review_points +
            budget_points +
            style_points +
            trend_points +
            data_points
        )

        score = int(
            round(
                max(
                    min(total, 100.0),
                    0.0,
                )
            )
        )

        # --------------------------------------------------------
        # VALUE SCORE
        # --------------------------------------------------------

        quality_average = (
            (rating_points / 15.0) * 0.60 +
            (review_points / 10.0) * 0.40
        ) * 100.0

        budget_percentage = (
            (budget_points / 20.0) * 100.0
        )

        value_score = int(
            round(
                budget_percentage * 0.60 +
                quality_average * 0.40
            )
        )

        # --------------------------------------------------------
        # WRITE RESULTS TO PRODUCT
        # --------------------------------------------------------

        product.score = score

        product.value_score = max(
            0,
            min(value_score, 100),
        )

        product.trend_score = max(
            0,
            min(int(trend_score), 100),
        )

        product.score_breakdown = {
            "relevance": int(
                round(relevance_points)
            ),
            "rating": int(
                round(rating_points)
            ),
            "reviews": int(
                round(review_points)
            ),
            "budget": int(
                round(budget_points)
            ),
            "style": int(
                round(style_points)
            ),
            "trend": int(
                round(trend_points)
            ),
            "data": int(
                round(data_points)
            ),
        }

        # --------------------------------------------------------
        # WHY VASTRA RECOMMENDED IT
        # --------------------------------------------------------

        reasons = []

        if category_match >= 0.85:
            reasons.append(
                "Strong match for the item you asked for"
            )

        if color_match >= 0.85 and intent.get("color"):
            reasons.append(
                "Matches your requested colour"
            )

        if rating is not None and rating >= 4.5:
            reasons.append(
                f"Highly rated at {rating:.1f}/5"
            )
        elif rating is not None and rating >= 4.0:
            reasons.append(
                f"Rated {rating:.1f}/5 by buyers"
            )

        if review_count >= 100:
            reasons.append(
                f"Backed by {review_count:,} buyer reviews"
            )
        elif review_count >= 20:
            reasons.append(
                f"Has {review_count:,} buyer reviews"
            )

        if budget is not None and price is not None:
            if price <= budget:
                reasons.append(
                    "Fits within your budget"
                )
            elif price <= budget * 1.10:
                reasons.append(
                    "Sits just above your budget"
                )

        if style_points >= 11:
            reasons.append(
                "Fits the style you're going for"
            )

        if trend_score >= 70:
            reasons.append(
                "Has styling details that feel current"
            )

        if not reasons:
            reasons.append(
                "Matches several parts of your request"
            )

        # Keep the list useful and concise.
        product.why_recommended = reasons[:4]

        return score
