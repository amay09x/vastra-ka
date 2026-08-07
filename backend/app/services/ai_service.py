import os
import json

from dotenv import load_dotenv
from groq import Groq

from app.prompts.shopping_prompt import SHOPPING_SYSTEM_PROMPT

load_dotenv()


class AIService:

    def __init__(self):

        self.client = Groq(
            api_key=os.getenv("GROQ_API_KEY")
        )

        self.model = "llama-3.3-70b-versatile"

    # ==========================================
    # INTENT EXTRACTION
    # ==========================================

    def understand_query(self, message):

        prompt = f"""
You are an AI fashion shopping assistant.

Extract the user's shopping intent.

Return ONLY valid JSON.

Example:

{{
    "category":"",
    "color":"",
    "budget":"",
    "style":"",
    "fit":"",
    "occasion":""
}}

User Message:

{message}
"""

        response = self.client.chat.completions.create(

            model=self.model,

            temperature=0,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        content = response.choices[0].message.content.strip()

        content = (
            content
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        print("\n===== CLEANED RESPONSE =====")
        print(content)
        print("============================\n")

        return json.loads(content)

    # ==========================================
    # FRIENDLY SHOPPING RESPONSE
    # ==========================================

    def generate_shopping_response(
        self,
        message,
        intent,
        products
    ):

        product_summary = []

        for product in products[:3]:

            reasons = "\n".join(
                f"- {reason}"
                for reason in product.why_recommended
            )

            score_breakdown = "\n".join(
                f"- {key.replace('_', ' ').title()}: {value}"
                for key, value in product.score_breakdown.items()
            )

            product_summary.append(
                f"""
Title: {product.title}

Price: {product.price}

Rating: {product.rating}

Reviews: {product.review_count}

DressAI Score: {product.score}/100

Score Breakdown:

{score_breakdown}

Why DressAI Recommended It:

{reasons}
"""
            )

        prompt = f"""
Customer Request:

{message}

Detected Intent:

{intent}

Products Ranked By DressAI:

{product_summary}

Instructions:

Recommend the best product based ONLY on the data above.

Never assume missing information.

Prefer products with better ratings and reviews.

Mention one cheaper alternative if appropriate.

Use the provided "Why DressAI Recommended It" reasons.

Do NOT invent new reasons.

If DressAI says the product fits the budget,
mention that.

If DressAI says it has excellent ratings,
mention that.

Trust the recommendation data more than your own assumptions.

Keep the tone friendly and conversational.

Reply like DressAI talking to a friend.
"""

        response = self.client.chat.completions.create(

            model=self.model,

            temperature=0.8,

            messages=[
                {
                    "role": "system",
                    "content": SHOPPING_SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content