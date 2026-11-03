import uuid
import base64
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import models
from dependencies import get_current_admin

router = APIRouter(prefix="/api/uploads", tags=["Uploads"])

import tempfile

try:
    UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
    UPLOAD_DIR.mkdir(exist_ok=True)
except Exception:
    UPLOAD_DIR = Path(tempfile.gettempdir()) / "uploads"
    UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/heic": ".heic",
    "image/bmp": ".bmp"
}

@router.post("")
async def upload_product_image(
    file: UploadFile = File(...),
    admin: models.User = Depends(get_current_admin)
):
    """
    Store an admin-uploaded saree image and return its public URL.
    No file size limitation. Supports all standard image formats.
    Returns both relative upload URL and base64 data URL for universal compatibility.
    """
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded image file is empty.")

    mime_type = file.content_type or "image/jpeg"
    ext = ALLOWED_EXTENSIONS.get(mime_type, ".jpg")
    filename = f"{uuid.uuid4().hex}{ext}"

    # Generate persistent Data URL so image works seamlessly across any serverless or static hosting
    b64_content = base64.b64encode(content).decode("utf-8")
    data_url = f"data:{mime_type};base64,{b64_content}"

    # Also save to disk if directory is writable
    try:
        target_path = UPLOAD_DIR / filename
        target_path.write_bytes(content)
        file_url = f"/uploads/{filename}"
    except Exception:
        file_url = data_url

    return {
        "url": data_url if len(content) < 4 * 1024 * 1024 else file_url,
        "data_url": data_url,
        "file_url": file_url,
        "filename": filename
    }

