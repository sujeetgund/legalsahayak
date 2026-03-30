import logging
import time
import uuid
from fastapi import APIRouter, Depends, HTTPException, Request

from models.schemas import QARequestModel, QAResponseModel
from services.qa_service import QAService
from core.exceptions import QAServiceError

logger = logging.getLogger(__name__)


qa_router = APIRouter(prefix="/qa", tags=["Question Answering"])


async def get_qa_service(request: Request) -> QAService:
    """Dependency to get the QAService instance"""
    if not hasattr(request.app.state, "qa_service"):
        raise HTTPException(status_code=503, detail="Service not initialized")
    return request.app.state.qa_service


@qa_router.post("/", response_model=QAResponseModel)
async def answer_question(
    request: QARequestModel,
    qa_service: QAService = Depends(get_qa_service),
):
    """
    Endpoint to answer questions based on document content.
    """
    trace_id = uuid.uuid4().hex[:12]
    start_time = time.time()

    try:
        logger.info(
            "trace_id=%s received QA question; preferred_language=%s",
            trace_id,
            request.preferred_language,
        )
        answer = await qa_service.get_answer(qa_request=request)
        latency_ms = (time.time() - start_time) * 1000
        logger.info(
            "trace_id=%s completed QA request in %.2fms with confidence=%.3f",
            trace_id,
            latency_ms,
            answer.confidence,
        )
        return answer
    except QAServiceError as e:
        latency_ms = (time.time() - start_time) * 1000
        logger.error(
            "trace_id=%s QA Service error in %.2fms: %s",
            trace_id,
            latency_ms,
            e,
        )
        raise HTTPException(
            status_code=500, detail="Failed to get answer from QA service."
        )
