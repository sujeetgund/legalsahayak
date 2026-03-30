from fastapi import APIRouter

from services.metrics_service import metrics_service


metrics_router = APIRouter(prefix="/metrics", tags=["Metrics"])


@metrics_router.get("/rag")
async def get_rag_metrics():
    """Returns in-memory RAG quality and performance metrics."""
    return metrics_service.snapshot()
