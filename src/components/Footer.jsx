import React, { useState } from "react";
import { Phone, Mail, MapPin, Heart } from "lucide-react";

export default function Footer({ setCurrentTab }) {
  const [activeModal, setActiveModal] = useState(null);

  const toggleModal = (modalName) => {
    setActiveModal(activeModal === modalName ? null : modalName);
  };

  return (
    <footer style={{
      backgroundColor: "#1e1516",
      color: "#e2e8f0",
      padding: "60px 0 30px 0",
      borderTop: "3px solid var(--accent-gold)",
      fontSize: "14px"
    }}>
      <div className="container" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "40px",
        marginBottom: "40px"
      }}>
        {/* Col 1: About the Brand */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{
            color: "var(--accent-gold)",
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px"
          }}>
            Sri Someshwara Silk Sarees
          </h3>
          <p style={{ color: "#94a3b8", lineHeight: "1.7" }}>
            Established in Yelahanka, Bengaluru. We manufacture and curate premium Gadwal Semi Silk and Gadwal Semi sicco sarees that harmonize ancestral handloom craftsmanship with modern comfort.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            {/* Pinterest Style link */}
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-gold)"
            }} aria-label="Visit our Pinterest">
              P
            </a>
            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-gold)"
            }} aria-label="Watch us on YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ display: "block" }}>
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.3 1.12.3 3.48.3 3.48s0 2.36-.3 3.48a2.01 2.01 0 0 1-1.415 1.42c-1.12.3-5.285.3-6.11.335h-.09c-.823-.003-4.987-.03-6.11-.335a2.01 2.01 0 0 1-1.415-1.42c-.3-1.12-.3-3.48-.3-3.48s0-2.36.3-3.48a2.01 2.01 0 0 1 1.415-1.42c1.122-.3 5.285-.3 6.11-.335zM6.5 5.5v5l4.5-2.5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h4 style={{
            color: "var(--accent-gold)",
            fontFamily: "'Playfair Display', serif",
            fontSize: "16px",
            borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
            paddingBottom: "8px"
          }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><a href="#/" onClick={() => setCurrentTab("home")} style={{ color: "#cbd5e1" }}>Home</a></li>
            <li><a href="#/shop" onClick={() => setCurrentTab("shop")} style={{ color: "#cbd5e1" }}>Shop Catalog</a></li>
            <li><a href="#/about" onClick={() => setCurrentTab("about")} style={{ color: "#cbd5e1" }}>Our Legacy Story</a></li>
            <li><a href="#/b2b" onClick={() => setCurrentTab("b2b")} style={{ color: "#cbd5e1" }}>B2B Wholesale Portal</a></li>
            <li><a href="#/contact" onClick={() => setCurrentTab("contact")} style={{ color: "#cbd5e1" }}>Contact Us</a></li>
          </ul>
        </div>

        {/* Col 3: Contact Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h4 style={{
            color: "var(--accent-gold)",
            fontFamily: "'Playfair Display', serif",
            fontSize: "16px",
            borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
            paddingBottom: "8px"
          }}>
            Store Information
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", color: "#cbd5e1" }}>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <MapPin size={18} style={{ color: "var(--accent-gold)", flexShrink: 0, marginTop: "2px" }} />
              <span>
                No. 95, 1st Main Road, 3rd Cross,<br />
                Markandaya Nagar, Agrahara Layout,<br />
                Yelahanka, Bengaluru – 560064
              </span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Phone size={16} style={{ color: "var(--accent-gold)" }} />
              <span>+91 XXXXX XXXXX / +91 YYYYY YYYYY</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Mail size={16} style={{ color: "var(--accent-gold)" }} />
              <span>sales@sssilksarees.com</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Business Hours / Location */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h4 style={{
            color: "var(--accent-gold)",
            fontFamily: "'Playfair Display', serif",
            fontSize: "16px",
            borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
            paddingBottom: "8px"
          }}>
            Weaving Mill Hours
          </h4>
          <p style={{ color: "#cbd5e1" }}>
            Monday – Saturday:<br />
            <strong>09:30 AM – 08:30 PM (IST)</strong><br />
            Sunday: By Appointment only.
          </p>
          <a
            href="https://maps.google.com/?q=Agrahara+Layout+Yelahanka+Bengaluru"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{
              padding: "8px 16px",
              fontSize: "13px",
              alignSelf: "flex-start",
              borderColor: "var(--accent-gold)",
              color: "var(--accent-gold)",
              marginTop: "8px"
            }}
          >
            Locate Weaving Center
          </a>
        </div>
      </div>

      {/* Bottom Bar & Legal Modals Trigger */}
      <div className="container" style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        paddingTop: "24px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        color: "#94a3b8",
        fontSize: "12px"
      }}>
        <p>© 2026 Sri Someshwara Silk Sarees. All Rights Reserved. Bengaluru, Karnataka.</p>

        <div style={{ display: "flex", gap: "16px" }}>
          <button onClick={() => toggleModal("privacy")} style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: "12px" }}>Privacy Policy</button>
          <span>|</span>
          <button onClick={() => toggleModal("terms")} style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: "12px" }}>Terms & Conditions</button>
          <span>|</span>
          <button onClick={() => toggleModal("shipping")} style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: "12px" }}>Shipping & Returns</button>
        </div>

        <p style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          Woven with <Heart size={10} fill="var(--accent-gold)" color="var(--accent-gold)" /> in Bengaluru
        </p>
      </div>

      {/* Legal Information Overlay Modals */}
      {activeModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px"
        }} onClick={() => setActiveModal(null)}>
          <div style={{
            backgroundColor: "var(--bg-white)",
            color: "var(--text-dark)",
            padding: "32px",
            borderRadius: "var(--radius-md)",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "80vh",
            overflowY: "auto",
            position: "relative",
            border: "1px solid var(--accent-gold)"
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "var(--primary-maroon)"
              }}
            >
              ✕
            </button>

            {activeModal === "privacy" && (
              <div>
                <h3 style={{ marginBottom: "16px" }}>Privacy Policy</h3>
                <p style={{ marginBottom: "12px" }}>Sri Someshwara Silk Sarees commits to protecting your privacy. We collect billing name, delivery address, phone number, and query parameters purely to fulfill product deliveries and coordinate WhatsApp sales channels.</p>
                <p style={{ marginBottom: "12px" }}>We never sell or distribute your data. All transactions are securely held locally. Wholesale query sheets are strictly kept internal.</p>
              </div>
            )}

            {activeModal === "terms" && (
              <div>
                <h3 style={{ marginBottom: "16px" }}>Terms & Conditions</h3>
                <p style={{ marginBottom: "12px" }}>By purchasing from our site or placing a custom order, you agree to our manufacturer policies. Handwoven/Semi-handloom silk sarees are prone to slight texture and threading variances, which reflect the authenticity of the weave.</p>
                <p style={{ marginBottom: "12px" }}>All B2B quotes generated are valid for 15 calendar days and require a 30% advance deposit prior to loom setup.</p>
              </div>
            )}

            {activeModal === "shipping" && (
              <div>
                <h3 style={{ marginBottom: "16px" }}>Shipping, Returns & Refunds</h3>
                <p style={{ marginBottom: "12px" }}><strong>Shipping:</strong> Standard domestic delivery across India takes 3–6 business days. Express Bengaluru shipping is fulfilled within 24 hours.</p>
                <p style={{ marginBottom: "12px" }}><strong>Returns:</strong> Since sarees are high-value delicate products (often one-off pieces), we accept returns within 7 days of delivery only if the product is damaged during transit. A clear unboxing video is required for damage claims.</p>
                <p style={{ marginBottom: "12px" }}><strong>Refunds:</strong> Once the loom return is verified, refunds are processed back via UPI/Bank transfer within 3 working days.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
