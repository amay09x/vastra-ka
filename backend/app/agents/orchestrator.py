from app.agents.intent_agent import IntentAgent
from app.agents.search_agent import SearchAgent
from app.agents.conversation_agent import ConversationAgent


class AIOrchestrator:

    def __init__(self):

        self.intent = IntentAgent()
        self.search = SearchAgent()
        self.conversation = ConversationAgent()

    def process(self, message):

        # Step 1 - Understand user intent
        intent = self.intent.analyze(message)

        # Step 2 - Search products
        products = self.search.search_products(intent)

        # Step 3 - Generate friendly AI reply
        assistant_message = self.conversation.generate_response(
            message,
            intent,
            products
        )

        return {

            "assistant_message": assistant_message,

            "intent": intent,

            "products": products
        }