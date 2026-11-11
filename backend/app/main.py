from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import schema as _schema  # noqa: F401 - register 3NF ORM tables
from app.routes.chat import router as chat_router
from app.routes.image_search import router as image_search_router
from app.routes.outfit_analysis import router as outfit_analysis_router
from app.routes.product_details_route import router as product_details_router
from app.routes.reviews_route import router as reviews_router
from app.routes.stylist_vision import router as stylist_vision_router
from app.routes.wishlist_route import router as wishlist_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup event: build 3NF database tables once Azure SQL is connected."""
    if engine is not None:
        try:
            Base.metadata.create_all(bind=engine)
            print("✅ Azure SQL tables created/verified.")
        except Exception as exc:
            print(
                f"⚠️ Database startup table creation skipped (DB unavailable): {exc}"
            )
    else:
        print(
            "⚠️ Skipping Base.metadata.create_all (AZURE_SQL_CONNECTION_STRING not configured)."
        )
    yield


app = FastAPI(
    title="DressAI API",
    description="AI Shopping Assistant Backend",
    version="1.0.0",
    lifespan=lifespan,
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
app.include_router(reviews_router)
app.include_router(stylist_vision_router)
app.include_router(wishlist_router)


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