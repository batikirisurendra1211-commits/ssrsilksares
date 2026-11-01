import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from config import settings

db_url = settings.DATABASE_URL

# When running in serverless cloud (Vercel) and DATABASE_URL is not yet set or still points to localhost,
# seamlessly use SQLite in /tmp so all endpoints and catalog work immediately!
is_cloud = os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME")
if is_cloud and ("localhost" in db_url or "127.0.0.1" in db_url):
    db_url = "sqlite:////tmp/sssilksarees.db"

connect_args = {}
engine_kwargs = {"pool_pre_ping": True}

if db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False
else:
    engine_kwargs["pool_size"] = 5
    engine_kwargs["max_overflow"] = 10

try:
    engine = create_engine(db_url, connect_args=connect_args, **engine_kwargs)
except Exception as e:
    print(f"Notice: Failed to initialize engine for {db_url} ({e}). Falling back to memory SQLite.")
    db_url = "sqlite:///:memory:"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
