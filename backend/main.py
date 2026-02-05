import logging
from fastapi import FastAPI
from contextlib import asynccontextmanager
from core.config import settings
from routes.qa_route import qa_router
from services.qa_service import QAService


# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.debug("⏺ DEBUG MODE ON")
    logger.info("Initializing services...")
    try:
        app.state.qa_service = QAService()
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
        raise

    yield

    logger.info("Shutting down services...")
    if hasattr(app.state, "qa_service"):
        await app.state.qa_service.cleanup()


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for answering questions based on document content using Google Generative AI",
    version=settings.API_VERSION,
    lifespan=lifespan,
    root_path=settings.API_PATH,
)

# Include routers
app.include_router(qa_router)


@app.get("/")
async def root():
    return {"version": settings.API_VERSION, "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
