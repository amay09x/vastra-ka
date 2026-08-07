from app.services.ai_service import AIService


class ConversationAgent:

    def __init__(self):
        self.ai = AIService()

    def generate_response(self, message, intent, products):
        return self.ai.generate_shopping_response(
            message,
            intent,
            products
        )