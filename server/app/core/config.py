import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "LumeScan"
    API_V1_STR: str = "/api/v1"
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    BYTEZ_API_KEY: str = os.getenv("BYTEZ_API_KEY", "")
    FALLBACK_MODEL: str = os.getenv("FALLBACK_MODEL", "Qwen/Qwen2.5-Coder-32B-Instruct")
    ALLOWED_ORIGINS: list[str] = [o.strip().rstrip("/") for o in os.getenv("ALLOWED_ORIGINS", "*").split(",")]

settings = Settings()
