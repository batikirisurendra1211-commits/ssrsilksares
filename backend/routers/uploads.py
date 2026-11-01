import uuid
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

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
}

@router.post("")
async def upload_product_image(
    file: UploadFile = File(...),
    admin: models.User = Depends(get_current_admin)
):
    """
    Store an admin-uploaded saree image and return its public URL.
    Uses UUID for random and conflict-free filenames.
    """
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=415, detail="Unsupported image format. Please upload JPG, PNG, or WebP.")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded image file is empty.")
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large. Maximum allowed size is 5 MB.")

    ext = ALLOWED_IMAGE_TYPES[file.content_type]
    filename = f"{uuid.uuid4().hex}{ext}"
    target_path = UPLOAD_DIR / filename
    target_path.write_bytes(content)

    return {
        "url": f"/uploads/{filename}",
        "filename": filename
    }

