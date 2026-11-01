import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from the backend folder
ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)

class Settings:
    PROJECT_NAME: str = "Sri Someshwara Silk Sarees API"
    VERSION: str = "2.0.0"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+pg8000://postgres:Root@localhost:5432/sssilksarees"
    )
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "b4a9f6e872c01d948210e7b89f5a34c19d7e5b2a0c8f1e3d6a9b4c7e2f5a8b1c")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # Cookies
    COOKIE_NAME: str = os.getenv("COOKIE_NAME", "ss_access_token")
    COOKIE_SECURE: bool = os.getenv("COOKIE_SECURE", "False").lower() in ("true", "1", "t")
    COOKIE_SAMESITE: str = os.getenv("COOKIE_SAMESITE", "lax")
    COOKIE_HTTPONLY: bool = os.getenv("COOKIE_HTTPONLY", "True").lower() in ("true", "1", "t")
    
    # Admin Setup
    ADMIN_SETUP_SECRET: str = os.getenv("ADMIN_SETUP_SECRET", "ss_super_secret_bootstrap_key_2026")
    
    # Stripe
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "sk_test_placeholder")
    
    # CORS
    CORS_ORIGINS: list = [
        origin.strip() 
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173").split(",")
        if origin.strip()
    ]

settings = Settings()

