import logging
from fastapi import APIRouter, Depends, HTTPException, Request

from models.schemas import QARequestModel, QAResponseModel
from core.security import verify_token
from core.config import settings
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
    Requires authentication via token.
    """
    try:
        logger.info(f"Received question: {request.question}")
        answer = await qa_service.get_answer(qa_request=request)
        return answer
    except QAServiceError as e:
        logger.error(f"QA Service error: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to get answer from QA service."
        )
