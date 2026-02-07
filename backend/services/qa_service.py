import time
import json
import logging
import asyncio

from core.config import settings
from core.prompt import template
from core.exceptions import QAServiceError
from models.schemas import QARequestModel, QAResponseModel

from langchain_groq import ChatGroq
from langchain_community.vectorstores import FAISS
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate

from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_text_splitters.markdown import MarkdownHeaderTextSplitter


# Configure logging
logger = logging.getLogger(__name__)


def format_docs(retrieved_docs):
    formatted_context = ""
    for i, doc in enumerate(retrieved_docs):
        source = doc.metadata.get("source", "Unknown Source")
        formatted_context += (
            f"Document {i+1} (Source: {source}):\n{doc.page_content}\n\n"
        )
    return formatted_context


class QAService:
    def __init__(self):
        start_time = time.time()

        self.llm = ChatGroq(
            model=settings.GROQ_MODEL_NAME,
            api_key=settings.GROQ_API_KEY,
            model_kwargs={
                "response_format": {
                    "type": "json_schema",
                    "json_schema": {
                        "name": "QAResponseModel",
                        "schema": QAResponseModel.model_json_schema(),
                    },
                },
            },
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
        self.vector_retriever = self.vectorstore.as_retriever(search_kwargs={"k": 5})
        # self.bm25_retriever = BM25Retriever.from_documents(
        #     documents=self._load_docs(), k=5
        # )
        # self.ensemble_retriever = EnsembleRetriever(
        #     retrievers=[self.vector_retriever, self.bm25_retriever],
        #     weights=[0.7, 0.3],
        # )
        self.qa_prompt = PromptTemplate.from_template(template)

        end_time = time.time()
        logger.info(f"QAService initialized in {end_time - start_time:.2f} seconds")

    def _load_docs(self):
        # Load markdown documents
        loader = DirectoryLoader(
            settings.DATA_DIR,
            glob="*.md",
            loader_cls=TextLoader,
            loader_kwargs={"encoding": "utf-8"},
        )
        raw_documents = loader.load()

        # Split documents and retain metadata
        headers_to_split_on = [
            ("#", "Act"),
            ("##", "Chapter"),
            ("###", "Section"),
        ]

        markdown_splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=headers_to_split_on
        )

        final_chunks = []
        for doc in raw_documents:
            header_splits = markdown_splitter.split_text(doc.page_content)

            # Manually add the source filename back into the metadata
            # (The splitter creates new Document objects, so we must re-attach the source)
            for split in header_splits:
                split.metadata.update(doc.metadata)
                final_chunks.append(split)
        return final_chunks

    async def cleanup(self):
        """Cleanup resources"""
        del self.llm
        del self.embedding_model
        del self.vectorstore
        del self.qa_prompt
        del self.vector_retriever
        # del self.bm25_retriever
        # del self.ensemble_retriever
        logger.info("QA service cleaned up")

    async def get_answer(self, qa_request: QARequestModel) -> QAResponseModel:
        try:
            logger.info("Processing QA request")
            logger.debug(f"Question: {qa_request.question}")
            logger.debug(
                f"Demographics: {qa_request.demographics.dict() if qa_request.demographics else 'None'}"
            )

            # Retrieve relevant documents (run in thread pool to avoid blocking)
            loop = asyncio.get_event_loop()
            logger.debug("Starting document retrieval from vector retriever...")

            try:
                retrieved_docs = await asyncio.wait_for(
                    loop.run_in_executor(
                        None, self.vector_retriever.invoke, qa_request.question
                    ),
                    timeout=120.0,
                )
                logger.debug(f"Retriever returned {len(retrieved_docs)} documents")

                if not retrieved_docs:
                    logger.warning("No documents retrieved for the question")
                    return QAResponseModel(
                        answer="I could not find relevant information in the knowledge base to answer your question.",
                        sources=[],
                        action_plan=None,
                        confidence_score=0.0,
                    )

                context = format_docs(retrieved_docs)
                logger.info(
                    f"Retrieved {len(retrieved_docs)} documents for the question"
                )
                logger.debug(f"Context length: {len(context)} characters")

            except asyncio.TimeoutError:
                logger.error("Document retrieval timed out after 120 seconds")
                raise QAServiceError("Document retrieval timed out") from None
            except Exception as e:
                logger.error(
                    f"Error during document retrieval: {type(e).__name__}: {e}",
                    exc_info=True,
                )
                raise

            # Format the prompt
            logger.debug("Formatting prompt with retrieved context...")
            try:
                formatted_prompt = self.qa_prompt.format(
                    user_question=qa_request.question,
                    user_age=qa_request.demographics.age,
                    user_gender=qa_request.demographics.gender,
                    user_location=qa_request.demographics.location,
                    user_education_level=qa_request.demographics.education_level,
                    user_job_title=qa_request.demographics.job_title,
                    retrieved_context=context,
                )
                logger.debug(
                    f"Formatted prompt length: {len(formatted_prompt)} characters"
                )
            except Exception as e:
                logger.error(
                    f"Error formatting prompt: {type(e).__name__}: {e}", exc_info=True
                )
                raise

            # Get the answer from the LLM (run in thread pool to avoid blocking)
            logger.debug("Invoking LLM for answer generation...")
            try:
                ai_response = await asyncio.wait_for(
                    loop.run_in_executor(None, self.llm.invoke, formatted_prompt),
                    timeout=60.0,
                )
                logger.debug(
                    f"LLM response type: {type(ai_response)}, content length: {len(ai_response.content)}"
                )

                json_response = json.loads(ai_response.content)
                logger.debug(f"Parsed JSON response keys: {list(json_response.keys())}")
                logger.info("Generated answer from LLM")

            except asyncio.TimeoutError:
                logger.error("LLM invocation timed out after 60 seconds")
                raise QAServiceError("LLM response generation timed out") from None
            except json.JSONDecodeError as e:
                logger.error(
                    f"Failed to parse LLM response as JSON: {e}", exc_info=True
                )
                logger.debug(f"Raw response content: {ai_response.content[:500]}")
                raise QAServiceError("Invalid JSON response from LLM") from e
            except Exception as e:
                logger.error(
                    f"Error invoking LLM: {type(e).__name__}: {e}", exc_info=True
                )
                raise

            # Validate and construct response
            logger.debug("Validating and constructing response model...")
            try:
                response = QAResponseModel(**json_response)
                logger.debug(
                    f"Response model created successfully with {len(response.legal_references) if response.legal_references else 0} legal references"
                )
                return response
            except Exception as e:
                logger.error(
                    f"Error constructing response model: {type(e).__name__}: {e}",
                    exc_info=True,
                )
                logger.debug(
                    f"JSON response data: {json.dumps(json_response, indent=2)[:500]}"
                )
                raise QAServiceError("Failed to construct response") from e

        except QAServiceError:
            raise
        except Exception as e:
            logger.error(
                f"Unexpected error in answering query: {type(e).__name__}: {e}",
                exc_info=True,
            )
            raise QAServiceError("Failed to process the QA request") from e
