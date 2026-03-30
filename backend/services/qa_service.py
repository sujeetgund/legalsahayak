import asyncio
import logging
import os
import time
from typing import List, Tuple

from core.config import settings
from core.exceptions import QAServiceError
from core.prompt import template
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from models.schemas import QARequestModel, QAResponseModel, SourcePassageModel
from services.metrics_service import metrics_service
from services.query_processor import QueryProcessor


# Configure logging
logger = logging.getLogger(__name__)


def _clip_text(text: str, max_chars: int = 900) -> str:
    compact = " ".join(text.split())
    if len(compact) <= max_chars:
        return compact
    return f"{compact[:max_chars].rstrip()}..."


def _distance_to_relevance(distance: float) -> float:
    return max(0.0, min(1.0, 1.0 / (1.0 + float(distance))))


def _display_source(source: str) -> str:
    return os.path.basename(source) if source else "Unknown Source"


def format_docs(retrieved_docs: List[Tuple[Document, float]]) -> str:
    blocks: List[str] = []
    for i, (doc, score) in enumerate(retrieved_docs, start=1):
        source = _display_source(doc.metadata.get("source", "Unknown Source"))
        section = (
            doc.metadata.get("Section")
            or doc.metadata.get("Chapter")
            or doc.metadata.get("Act")
            or "General"
        )
        relevance = _distance_to_relevance(score)
        content = _clip_text(doc.page_content, max_chars=1200)
        blocks.append(
            f"Document {i} (Source: {source}, Section: {section}, Relevance: {relevance:.3f}):\n{content}"
        )
    return "\n\n".join(blocks)


class QAService:
    def __init__(self):
        start_time = time.time()

        self.llm = ChatGroq(
            model=settings.GROQ_MODEL_NAME,
            api_key=settings.GROQ_API_KEY,
        )
        self.structured_llm = self.llm.with_structured_output(
            QAResponseModel,
            method="json_schema"
        )
        logger.info("Loading embedding model...")
        self.embedding_model = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL_NAME,
            encode_kwargs={"normalize_embeddings": True},
            show_progress=True,
        )
        logger.info("Embedding model loaded successfully")
        self.vectorstore = FAISS.load_local(
            settings.FAISS_INDEX_DIR,
            self.embedding_model,
            allow_dangerous_deserialization=True,
        )
        self.retrieval_k = 5
        self.query_processor = QueryProcessor()
        self.qa_prompt = PromptTemplate.from_template(template)

        end_time = time.time()
        logger.info(f"QAService initialized in {end_time - start_time:.2f} seconds")

    def _retrieve_with_scores(self, queries: List[str]) -> List[Tuple[Document, float]]:
        all_results: List[Tuple[Document, float]] = []
        for query in queries:
            results = self.vectorstore.similarity_search_with_score(
                query,
                k=self.retrieval_k,
            )
            all_results.extend(results)

        deduped: List[Tuple[Document, float]] = []
        seen = set()
        for doc, score in sorted(all_results, key=lambda item: float(item[1])):
            source = doc.metadata.get("source", "")
            key = (source, doc.page_content[:220])
            if key in seen:
                continue
            seen.add(key)
            deduped.append((doc, float(score)))

        return deduped[: self.retrieval_k + 1]

    def _build_source_passages(
        self, retrieved_docs: List[Tuple[Document, float]]
    ) -> List[SourcePassageModel]:
        passages: List[SourcePassageModel] = []
        seen_sources = set()

        for doc, score in retrieved_docs:
            source = _display_source(doc.metadata.get("source", "Unknown Source"))
            if source in seen_sources:
                continue
            seen_sources.add(source)

            section = (
                doc.metadata.get("Section")
                or doc.metadata.get("Chapter")
                or doc.metadata.get("Act")
            )
            passages.append(
                SourcePassageModel(
                    source=source,
                    section=section,
                    quote=_clip_text(doc.page_content, max_chars=280),
                    relevance_score=round(_distance_to_relevance(score), 3),
                )
            )
            if len(passages) >= 4:
                break

        return passages

    def _heuristic_confidence(
        self,
        retrieved_docs: List[Tuple[Document, float]],
        llm_confidence: float,
        source_passage_count: int,
        decomposition_used: bool,
    ) -> float:
        if not retrieved_docs:
            return 0.0

        top_scores = [_distance_to_relevance(score) for _, score in retrieved_docs[:3]]
        retrieval_signal = sum(top_scores) / len(top_scores)
        citation_signal = min(1.0, source_passage_count / 3.0)
        decomposition_bonus = 0.05 if decomposition_used else 0.0

        blended = (0.65 * retrieval_signal) + (0.25 * citation_signal) + (0.1 * llm_confidence)
        return round(max(0.0, min(1.0, blended + decomposition_bonus)), 3)

    async def cleanup(self):
        """Cleanup resources"""
        del self.llm
        del self.structured_llm
        del self.embedding_model
        del self.vectorstore
        del self.qa_prompt
        del self.query_processor
        logger.info("QA service cleaned up")

    def _record_success_metrics(
        self,
        *,
        request_start: float,
        decomposition_used: bool,
        retrieved_doc_count: int,
        context_chars: int,
        confidence: float,
        preferred_language: str,
    ) -> None:
        metrics_service.record_success(
            latency_ms=(time.time() - request_start) * 1000,
            decomposition_used=decomposition_used,
            retrieved_doc_count=retrieved_doc_count,
            context_chars=context_chars,
            confidence=confidence,
            preferred_language=preferred_language,
        )

    async def _retrieve_documents(
        self,
        *,
        loop: asyncio.AbstractEventLoop,
        sub_queries: List[str],
    ) -> List[Tuple[Document, float]]:
        try:
            retrieved_docs_with_scores = await asyncio.wait_for(
                loop.run_in_executor(None, self._retrieve_with_scores, sub_queries),
                timeout=120.0,
            )
            logger.debug(
                "Retriever returned %s merged documents",
                len(retrieved_docs_with_scores),
            )
            return retrieved_docs_with_scores
        except asyncio.TimeoutError:
            logger.error("Document retrieval timed out after 120 seconds")
            raise QAServiceError("Document retrieval timed out") from None
        except Exception as e:
            logger.error(
                f"Error during document retrieval: {type(e).__name__}: {e}",
                exc_info=True,
            )
            raise QAServiceError("Document retrieval failed") from e

    def _format_prompt(self, qa_request: QARequestModel, context: str) -> str:
        try:
            formatted_prompt = self.qa_prompt.format(
                user_question=qa_request.question,
                user_age=qa_request.demographics.age,
                user_gender=qa_request.demographics.gender,
                user_location=qa_request.demographics.location,
                user_education_level=qa_request.demographics.education_level,
                user_job_title=qa_request.demographics.job_title,
                preferred_language=(
                    "Hindi" if qa_request.preferred_language == "hi" else "English"
                ),
                retrieved_context=context,
            )
            logger.debug("Formatted prompt length: %s characters", len(formatted_prompt))
            return formatted_prompt
        except Exception as e:
            logger.error(
                f"Error formatting prompt: {type(e).__name__}: {e}", exc_info=True
            )
            raise QAServiceError("Prompt formatting failed") from e

    async def _invoke_structured_llm(
        self,
        *,
        loop: asyncio.AbstractEventLoop,
        formatted_prompt: str,
    ) -> QAResponseModel:
        try:
            structured_response = await asyncio.wait_for(
                loop.run_in_executor(
                    None,
                    self.structured_llm.invoke,
                    formatted_prompt,
                ),
                timeout=60.0,
            )
            logger.debug("Structured LLM response type: %s", type(structured_response))
            logger.info("Generated answer from LLM")
            if isinstance(structured_response, QAResponseModel):
                return structured_response
            return QAResponseModel.model_validate(structured_response)
        except asyncio.TimeoutError:
            logger.error("LLM invocation timed out after 60 seconds")
            raise QAServiceError("LLM response generation timed out") from None
        except Exception as e:
            logger.error(
                f"Error invoking LLM: {type(e).__name__}: {e}", exc_info=True
            )
            raise QAServiceError("LLM invocation failed") from e

    def _finalize_response(
        self,
        *,
        structured_response: QAResponseModel,
        source_passages: List[SourcePassageModel],
        retrieved_docs_with_scores: List[Tuple[Document, float]],
        decomposition_used: bool,
    ) -> QAResponseModel:
        response = structured_response
        if not response.source_passages:
            response.source_passages = source_passages
        if not response.legal_references:
            response.legal_references = [
                passage.source for passage in response.source_passages
            ]

        response.confidence = self._heuristic_confidence(
            retrieved_docs=retrieved_docs_with_scores,
            llm_confidence=response.confidence,
            source_passage_count=len(response.source_passages),
            decomposition_used=decomposition_used,
        )
        return response

    async def get_answer(self, qa_request: QARequestModel) -> QAResponseModel:
        request_start = time.time()
        try:
            logger.info("Processing QA request")
            logger.debug(f"Question: {qa_request.question}")
            logger.debug(
                f"Demographics: {qa_request.demographics.model_dump() if qa_request.demographics else 'None'}"
            )
            logger.debug(f"Preferred language: {qa_request.preferred_language}")

            loop = asyncio.get_event_loop()
            sub_queries = self.query_processor.decompose(qa_request.question)
            decomposition_used = len(sub_queries) > 1
            logger.debug(
                "Starting document retrieval; decomposition_used=%s; sub_queries=%s",
                decomposition_used,
                sub_queries,
            )
            retrieved_docs_with_scores = await self._retrieve_documents(
                loop=loop,
                sub_queries=sub_queries,
            )

            if not retrieved_docs_with_scores:
                logger.warning("No documents retrieved for the question")
                fallback_response = QAResponseModel(
                    answer="I could not find relevant information in the knowledge base to answer your question.",
                    legal_references=[],
                    action_plan=[],
                    source_passages=[],
                    confidence=0.0,
                )
                self._record_success_metrics(
                    request_start=request_start,
                    decomposition_used=decomposition_used,
                    retrieved_doc_count=0,
                    context_chars=0,
                    confidence=0.0,
                    preferred_language=qa_request.preferred_language,
                )
                return fallback_response

            source_passages = self._build_source_passages(retrieved_docs_with_scores)
            context = format_docs(retrieved_docs_with_scores)
            logger.info(
                "Retrieved %s documents for the question",
                len(retrieved_docs_with_scores),
            )
            logger.debug("Context length: %s characters", len(context))

            logger.debug("Formatting prompt with retrieved context...")
            formatted_prompt = self._format_prompt(qa_request, context)

            logger.debug("Invoking LLM for answer generation...")
            structured_response = await self._invoke_structured_llm(
                loop=loop,
                formatted_prompt=formatted_prompt,
            )

            logger.debug("Finalizing response model...")
            response = self._finalize_response(
                structured_response=structured_response,
                source_passages=source_passages,
                retrieved_docs_with_scores=retrieved_docs_with_scores,
                decomposition_used=decomposition_used,
            )

            self._record_success_metrics(
                request_start=request_start,
                decomposition_used=decomposition_used,
                retrieved_doc_count=len(retrieved_docs_with_scores),
                context_chars=len(context),
                confidence=response.confidence,
                preferred_language=qa_request.preferred_language,
            )
            logger.debug(
                "Response model created successfully with %s legal references",
                len(response.legal_references),
            )
            return response

        except QAServiceError:
            metrics_service.record_error()
            raise
        except Exception as e:
            metrics_service.record_error()
            logger.error(
                f"Unexpected error in answering query: {type(e).__name__}: {e}",
                exc_info=True,
            )
            raise QAServiceError("Failed to process the QA request") from e
