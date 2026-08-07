class RecommendationAgent:

    def recommend(self, products):

        if not products:
            return "No products found."

        return f"Found {len(products)} matching products. Preparing AI recommendations..."