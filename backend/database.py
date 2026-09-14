import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+pg8000://postgres:postgres@localhost:5432/sssilksarees")

# Robust fallback to SQLite if PostgreSQL connection fails (e.g. server not started yet)
try:
    # Try connecting to PostgreSQL via pg8000
    engine = create_engine(DATABASE_URL, connect_args={"timeout": 3} if "pg8000" in DATABASE_URL else {})
    with engine.connect() as conn:
        print("Successfully connected to PostgreSQL database.")
except Exception as e:
    print(f"Warning: PostgreSQL connection failed ({e}). Falling back to SQLite local database (sssilksarees.db).")
    DATABASE_URL = "sqlite:///./sssilksarees.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
