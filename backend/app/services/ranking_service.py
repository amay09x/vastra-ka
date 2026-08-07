class RankingService:

    def calculate_score(self, product, intent):

        score = 0

        value_score = 50

        trend_score = 50

        breakdown = {}

        reasons = []

        # -----------------------------
        # Rating
        # -----------------------------

        if product.rating:

            if product.rating >= 4.5:

                score += 40

                breakdown["rating"] = 40

                reasons.append(
                    "Excellent customer rating ⭐"
                )

            elif product.rating >= 4:

                score += 30

                breakdown["rating"] = 30

                reasons.append(
                    "Very good customer rating"
                )

            else:

                score += 15

                breakdown["rating"] = 15

        else:

            breakdown["rating"] = 0

        # -----------------------------
        # Reviews
        # -----------------------------

        if product.review_count:

            if product.review_count > 10000:

                score += 30

                breakdown["reviews"] = 30

                reasons.append(
                    "Trusted by thousands of buyers"
                )

            elif product.review_count > 1000:

                score += 20

                breakdown["reviews"] = 20

                reasons.append(
                    "Popular among shoppers"
                )

            else:

                score += 10

                breakdown["reviews"] = 10

        else:

            breakdown["reviews"] = 0

        # -----------------------------
        # Budget
        # -----------------------------

        if intent.get("budget") and product.price:

            try:

                budget = float(
                    str(intent["budget"])
                    .replace("₹", "")
                    .replace(",", "")
)

                price = float(
                    str(product.price)
                    .replace("₹", "")
                    .replace(",", "")
)

                if price <= budget:

                    score += 15

                    value_score += 25

                    breakdown["budget"] = 15

                    reasons.append(
                        "Fits your budget"
                    )

            except:

                breakdown["budget"] = 0

        # -----------------------------
        # Style Match
        # -----------------------------

        style = intent.get("style")

        if style and style.lower() in product.title.lower():

            score += 10

            trend_score += 25

            breakdown["style"] = 10

            reasons.append(
                "Matches your preferred style"
            )

        else:

            breakdown["style"] = 0

        # -----------------------------
        # Official Store
        # -----------------------------

        if product.buy_now:

            score += 5

            breakdown["merchant"] = 5

            reasons.append(
                "Available from a trusted store"
            )

        else:

            breakdown["merchant"] = 0

        # -----------------------------
        # Save Results
        # -----------------------------

        product.score = score

        product.value_score = min(value_score, 100)

        product.trend_score = min(trend_score, 100)

        product.score_breakdown = breakdown

        product.why_recommended = reasons

        return score