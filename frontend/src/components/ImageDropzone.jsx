import React, { useRef, useState } from "react";
import { LoaderCircle, UploadCloud, X, Image as ImageIcon } from "lucide-react";
import api from "../api/apiClient";

export default function ImageDropzone({ value, onChange, onImageUploaded, currentImage }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const displayImage = value || currentImage || "";

  const notifyChange = (url) => {
    if (typeof onChange === "function") onChange(url);
    if (typeof onImageUploaded === "function") onImageUploaded(url);
  };

  /**
   * Reads any image file and automatically optimizes large high-res camera photos
   * so they upload and render instantly without any size limit errors.
   */
  const processAndOptimizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // If the image is excessively large, scale it down to max 1600px dimension
          const maxDim = 1600;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
          resolve(optimizedDataUrl);
        };
        img.onerror = () => resolve(e.target.result); // Fallback to raw data URI
        img.src = e.target.result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const upload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP, etc.).");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // 1. Process client-side: no size limit, instant high-res optimization
      const optimizedDataUrl = await processAndOptimizeImage(file);
      // Immediately set image so admin can view & submit without blocking
      notifyChange(optimizedDataUrl);

      // 2. Also try backend upload in background
      try {
        const formData = new FormData();
        formData.append("file", file);
        const result = await api.uploads.uploadImage(formData);
        if (result && (result.data_url || result.url)) {
          notifyChange(result.data_url || result.url);
        }
      } catch (serverErr) {
        // Client-side optimized image is already set, so backend filesystem limitation won't block the user
        console.warn("Backend image upload note (using optimized client preview):", serverErr);
      }
    } catch (err) {
      console.error("Image processing error:", err);
      setError("Failed to process image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Saree Photograph <span style={{ color: "#dc2626" }}>*</span></span>
        <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "normal" }}>No file size limit · All formats supported</span>
      </label>

      {displayImage ? (
        <div style={{
          position: "relative",
          border: "1px solid var(--border-light)",
          borderRadius: "10px",
          overflow: "hidden",
          background: "var(--bg-cream)"
        }}>
          <img 
            src={displayImage} 
            alt="Saree upload preview" 
            style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} 
          />
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 12px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderTop: "1px solid var(--border-light)"
          }}>
            <button 
              type="button" 
              onClick={() => inputRef.current?.click()} 
              className="btn btn-outline" 
              style={{ minHeight: "auto", padding: "6px 12px", fontSize: "12px" }}
            >
              Replace photo
            </button>
            <button 
              type="button" 
              onClick={() => notifyChange("")} 
              aria-label="Remove uploaded photo" 
              style={{ border: "none", background: "none", color: "#dc2626", cursor: "pointer", padding: "5px", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}
            >
              <X size={16} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            if (event.dataTransfer.files && event.dataTransfer.files[0]) {
              upload(event.dataTransfer.files[0]);
            }
          }}
          style={{
            width: "100%",
            minHeight: "160px",
            border: `2px dashed ${dragging ? "var(--accent-gold)" : "var(--border-light)"}`,
            borderRadius: "10px",
            background: dragging ? "rgba(202, 138, 4, 0.08)" : "var(--bg-cream)",
            color: "var(--text-muted)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "0.2s"
          }}
        >
          {uploading ? (
            <LoaderCircle size={32} className="upload-spinner" style={{ color: "var(--accent-gold)" }} />
          ) : (
            <UploadCloud size={32} style={{ color: "var(--accent-gold)" }} />
          )}
          <strong style={{ color: "var(--text-dark)", fontSize: "14px" }}>
            {uploading ? "Processing saree photograph…" : "Click or drag saree photo here"}
          </strong>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            JPG, PNG, WebP, HEIC · Any size supported
          </span>
        </button>
      )}

      <input 
        ref={inputRef} 
        type="file" 
        accept="image/*" 
        onChange={(event) => {
          if (event.target.files && event.target.files[0]) {
            upload(event.target.files[0]);
          }
        }} 
        style={{ display: "none" }} 
      />

      {error && <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "6px" }}>{error}</p>}
      <style>{`.upload-spinner { animation: upload-spin 0.9s linear infinite; } @keyframes upload-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
