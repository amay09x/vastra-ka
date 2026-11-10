from app.agents.intent_agent import IntentAgent
from app.agents.search_agent import SearchAgent
from app.agents.conversation_agent import ConversationAgent
from app.services.ai_service import AIService


class AIOrchestrator:

    def __init__(self):
        self.intent = IntentAgent()
        self.search = SearchAgent()
        self.conversation = ConversationAgent()
        self.ai = AIService()

    # =========================================================
    # BUILD FULL CONVERSATION
    # =========================================================

    @staticmethod
    def _build_conversation(message, history=None):

        history = history or []

        conversation_parts = []

        for item in history:

            # Pydantic ChatMessage object
            if hasattr(item, "role") and hasattr(item, "content"):

                role = item.role
                content = item.content

            # Dictionary
            elif isinstance(item, dict):

                role = item.get("role", "user")
                content = item.get("content", "")

            else:
                continue

            if not content:
                continue

            conversation_parts.append(
                f"{role}: {content}"
            )

        # -----------------------------------------------------
        # Add current user message
        #
        # Avoid duplicating it if the frontend already included
        # the current message in history.
        # -----------------------------------------------------

        current_message = message.strip()

        already_exists = any(
            part == f"user: {current_message}"
            for part in conversation_parts
        )

        if current_message and not already_exists:

            conversation_parts.append(
                f"user: {current_message}"
            )

        return "\n".join(
            conversation_parts
        )

    # =========================================================
    # MAIN PROCESS
    # =========================================================

    def process(self, message, history=None):

        history = history or []

        # =====================================================
        # STEP 1
        # Let VASTRA understand the conversation first
        # =====================================================

        stylist_result = self.ai.generate_stylist_response(
            message=message,
            history=history,
        )

        assistant_message = stylist_result.get(
            "response",
            "Tell me a little more about what you'd like to wear."
        )

        ready_for_search = bool(
            stylist_result.get(
                "ready_for_search",
                False
            )
        )

        print("\n========== VASTRA STYLIST ==========")
        print("Message:")
        print(message)
        print("Ready for search:", ready_for_search)
        print("Assistant:")
        print(assistant_message)
        print("====================================\n")

        # =====================================================
        # STEP 2
        # NOT ENOUGH INFORMATION
        #
        # Return the question immediately.
        # DO NOT search products.
        # =====================================================

        if not ready_for_search:

            return {
                "assistant_message": assistant_message,
                "intent": {},
                "products": [],
                "ready_for_search": False,
            }

        # =====================================================
        # STEP 3
        # Build COMPLETE conversation
        # =====================================================

        full_conversation = self._build_conversation(
            message=message,
            history=history,
        )

        print("\n========== FULL CONVERSATION ==========")
        print(full_conversation)
        print("=======================================\n")

        # =====================================================
        # STEP 4
        # Extract shopping intent from EVERYTHING
        # =====================================================

        intent = self.intent.analyze(
            full_conversation
        )

        print("\n========== FINAL INTENT ==========")
        print(intent)
        print("==================================\n")

        # =====================================================
        # STEP 5
        # Search products ONLY NOW
        # =====================================================

        products = self.search.search_products(
            intent,
            full_conversation
)
        print("\n========== PRODUCTS FOUND ==========")
        print(f"Count: {len(products)}")
        print("====================================\n")

        # =====================================================
        # STEP 6
        # Generate final outfit/product response
        # =====================================================

        assistant_message = (
            self.conversation.generate_response(
                full_conversation,
                intent,
                products,
            )
        )

        # =====================================================
        # STEP 7
        # FINAL RESULT
        # =====================================================

        return {
            "assistant_message": assistant_message,
            "intent": intent,
            "products": products,
            "ready_for_search": True,
        }