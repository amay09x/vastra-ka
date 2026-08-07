from fastapi import APIRouter

from app.models.chat_models import ChatRequest

from app.agents.orchestrator import AIOrchestrator

router = APIRouter()

orchestrator = AIOrchestrator()


@router.post("/chat")
def chat(request: ChatRequest):

    return orchestrator.process(request.message)