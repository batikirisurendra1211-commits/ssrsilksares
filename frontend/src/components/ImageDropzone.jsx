import React, { useRef, useState } from "react";
import { ImagePlus, LoaderCircle, UploadCloud, X } from "lucide-react";
import api from "../api/apiClient";

export default function ImageDropzone({ value, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Images must be 5 MB or smaller.");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const result = await api.uploads.uploadImage(data);
      if (!result || !result.url) throw new Error("Upload failed. No URL returned.");
      onChange(result.url);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="form-label">Saree Photograph <span style={{ color: "#dc2626" }}>*</span></label>
      {value ? (
        <div style={{ position: "relative", border: "1px solid var(--border-light)", borderRadius: "10px", overflow: "hidden", background: "var(--bg-cream)" }}>
          <img src={value} alt="Saree upload preview" style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 10px" }}>
            <button type="button" onClick={() => inputRef.current?.click()} className="btn btn-outline" style={{ minHeight: "auto", padding: "6px 10px", fontSize: "12px" }}>Replace photo</button>
            <button type="button" onClick={() => onChange("")} aria-label="Remove uploaded photo" style={{ border: "none", background: "none", color: "#dc2626", cursor: "pointer", padding: "5px" }}><X size={18} /></button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); upload(event.dataTransfer.files[0]); }}
          style={{ width: "100%", minHeight: "160px", border: `2px dashed ${dragging ? "var(--accent-gold)" : "var(--border-light)"}`, borderRadius: "10px", background: dragging ? "rgba(202, 138, 4, 0.08)" : "var(--bg-cream)", color: "var(--text-muted)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", transition: "0.2s" }}
        >
          {uploading ? <LoaderCircle size={28} className="upload-spinner" /> : <UploadCloud size={28} style={{ color: "var(--accent-gold)" }} />}
          <strong style={{ color: "var(--text-dark)", fontSize: "13px" }}>{uploading ? "Uploading your photo…" : "Drop your saree photo here"}</strong>
          <span style={{ fontSize: "12px" }}>or click to browse · JPG, PNG, WebP · up to 5 MB</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => upload(event.target.files[0])} style={{ display: "none" }} />
      {error && <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "6px" }}>{error}</p>}
      <style>{`.upload-spinner { animation: upload-spin 0.9s linear infinite; } @keyframes upload-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
