from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat import router as chat_router
from app.routes.image_search import router as image_search_router
from app.routes.outfit_analysis import router as outfit_analysis_router
from app.routes.product_details_route import router as product_details_router
from app.routes.stylist_vision import router as stylist_vision_router


app = FastAPI(
    title="DressAI API",
    description="AI Shopping Assistant Backend",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(chat_router)
app.include_router(image_search_router)
app.include_router(outfit_analysis_router)
app.include_router(product_details_router)
app.include_router(stylist_vision_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Vastra 🚀",
        "version": "1.0.0",
        "status": "Running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }