from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import engine, Base
from config import settings
from routers import auth, products, orders, payments, uploads, audit

# Ensure uploads directory exists safely (supporting serverless read-only filesystems)
try:
    UPLOAD_DIR = Path(__file__).resolve().parent / "uploads"
    UPLOAD_DIR.mkdir(exist_ok=True)
except Exception:
    import tempfile
    UPLOAD_DIR = Path(tempfile.gettempdir()) / "uploads"
    UPLOAD_DIR.mkdir(exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown events.
    Verifies database connection and ensures tables are present.
    """
    try:
        Base.metadata.create_all(bind=engine)
        print("Successfully connected to database and verified tables.")
    except Exception as e:
        print(f"Notice: Database startup check ({e}). Alembic migrations manage the primary schema.")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-ready FastAPI backend for Sri Someshwara Silk Sarees with PostgreSQL, UUIDs, JWT HTTP-Only Cookies, Admin MFA, and Application Audit Logs.",
    version=settings.VERSION,
    lifespan=lifespan
)

# Static file serving for uploaded saree images
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Configure CORS for Vite frontend & production
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all modular routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(payments.router)
app.include_router(uploads.router)
app.include_router(audit.router)

@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "status": "online",
        "version": settings.VERSION,
        "database": "PostgreSQL",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
