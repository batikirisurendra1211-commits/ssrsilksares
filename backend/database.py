import os
import shutil
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from config import settings

backend_dir = Path(__file__).resolve().parent
db_url = settings.DATABASE_URL

# When deployed to Vercel/cloud and DATABASE_URL still points to localhost,
# seamlessly fallback to the bundled SQLite database so /api/* works immediately!
is_cloud = os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME")
if is_cloud and ("localhost" in db_url or "127.0.0.1" in db_url):
    src_db = backend_dir / "sssilksarees.db"
    tmp_db = Path("/tmp/sssilksarees.db")
    if src_db.exists():
        try:
            if not tmp_db.exists():
                shutil.copyfile(src_db, tmp_db)
            db_url = f"sqlite:///{tmp_db}"
        except Exception:
            db_url = f"sqlite:///{src_db}"

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
    print(f"Notice: Failed to initialize engine for {db_url} ({e}). Falling back to in-memory SQLite.")
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
