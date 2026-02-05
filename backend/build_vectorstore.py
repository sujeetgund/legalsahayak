from langchain_community.vectorstores import FAISS
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_text_splitters.markdown import MarkdownHeaderTextSplitter
import os
import logging
from core.config import settings

logger = logging.getLogger(__name__)


def build_vectorstore(data_dir: str, index_path: str) -> FAISS:
    """Builds a FAISS vector store from text documents in the specified directory.

    Args:
        data_dir (str): The directory containing text documents.
        index_path (str): The directory to save the FAISS index.

    Returns:
        FAISS: The built FAISS vector store.
    """
    # Load documents from the specified directory
    loader = DirectoryLoader(
        data_dir,
        glob="*.md",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"},
    )
    logger.info(f"Loading documents from {data_dir}...")
    documents = loader.load()

    headers_to_split_on = [
        ("#", "Act"),
        ("##", "Chapter"),
        ("###", "Section"),
    ]

    markdown_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=headers_to_split_on
    )

    final_chunks = []

    for doc in documents:
        header_splits = markdown_splitter.split_text(doc.page_content)

        # Manually add the source filename back into the metadata
        # (The splitter creates new Document objects, so we must re-attach the source)
        for split in header_splits:
            split.metadata.update(doc.metadata)
            final_chunks.append(split)

    # Initialize HuggingFace embeddings
    embeddings = HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL_NAME)

    # Create FAISS vector store from documents and embeddings
    logger.info("Creating FAISS vector store from documents and embeddings...")
    vectorstore = FAISS.from_documents(final_chunks, embeddings)

    # Save the FAISS index to the specified path
    vectorstore.save_local(index_path)
    logger.info(f"FAISS index saved to {index_path}")

    return vectorstore


if __name__ == "__main__":
    data_directory = settings.DATA_DIR

    faiss_index_directory = settings.FAISS_INDEX_DIR
    if not os.path.exists(faiss_index_directory):
        os.makedirs(faiss_index_directory)
        logger.info(f"Created directory for FAISS index at {faiss_index_directory}")
    build_vectorstore(data_directory, faiss_index_directory)
