from fastapi import FastAPI
from app.routes.chat import router as chat_router

app = FastAPI(
    title="DressAI API",
    description="AI Shopping Assistant Backend",
    version="1.0.0"
)

# Register routes AFTER creating the app
app.include_router(chat_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to DressAI 🚀",
        "version": "1.0.0",
        "status": "Running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }