from app.services.ai_service import AIService


class IntentAgent:

    def __init__(self):

        self.ai = AIService()

    def analyze(self, message):

        return self.ai.understand_query(message)