from app.services.ai_service import AIService

ai = AIService()

print(
    ai.understand_query(
        "I need a black oversized hoodie under 2000"
    )
)