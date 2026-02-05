from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from pathlib import Path

load_dotenv()


class Settings(BaseSettings):
    # API Settings
    GROQ_API_KEY: str
    GROQ_MODEL_NAME: str = "openai/gpt-oss-120b"
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"

    # Project Settings
    PROJECT_NAME: str = "Legal Sahayak API"
    API_PATH: str = "/api/v1"
    API_VERSION: str = "1.0.0"

    DATA_DIR: Path = Path("data")
    FAISS_INDEX_DIR: Path = Path("faiss_index")

    # Security Settings
    BEARER_TOKEN: str

    class Config:
        env_file = ".env"


settings = Settings()
