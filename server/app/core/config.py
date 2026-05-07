import os

from dotenv import load_dotenv

load_dotenv()

class Settings:
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    _raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
    ALLOWED_ORIGINS: list[str] = [
        o.strip().rstrip("/") for o in _raw_origins.split(",")
    ]

settings = Settings()
