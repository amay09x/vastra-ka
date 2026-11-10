from fastapi import APIRouter

from app.models.chat_models import ChatRequest
from app.agents.orchestrator import AIOrchestrator

router = APIRouter()

orchestrator = AIOrchestrator()


@router.post("/chat")
def chat(request: ChatRequest):

    result = orchestrator.process(
        message=request.message,
        history=request.history,
    )
    print("\n========== CHAT RESPONSE ==========")
    print(result)
    print("===================================\n")

    return {
        "success": True,
        "response": result,
    }