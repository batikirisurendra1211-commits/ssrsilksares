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
          <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
            {/* Instagram */}
            <a href="https://www.instagram.com/sssilksarees49/" target="_blank" rel="noopener noreferrer" style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-gold)",
              border: "1px solid rgba(212,175,55,0.2)"
            }} aria-label="Follow us on Instagram (@sssilksarees49)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
              </svg>
            </a>
            {/* YouTube */}
            <a href="https://www.youtube.com/@SSSilksarees" target="_blank" rel="noopener noreferrer" style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-gold)",
              border: "1px solid rgba(212,175,55,0.2)"
            }} aria-label="Watch us on YouTube (@SSSilksarees)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.3 1.12.3 3.48.3 3.48s0 2.36-.3 3.48a2.01 2.01 0 0 1-1.415 1.42c-1.12.3-5.285.3-6.11.335h-.09c-.823-.003-4.987-.03-6.11-.335a2.01 2.01 0 0 1-1.415-1.42c-.3-1.12-.3-3.48-.3-3.48s0-2.36.3-3.48a2.01 2.01 0 0 1 1.415-1.42c1.122-.3 5.285-.3 6.11-.335zM6.5 5.5v5l4.5-2.5z" />
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-gold)",
              border: "1px solid rgba(212,175,55,0.2)"
            }} aria-label="Follow us on Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
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
              <span>
                <a href="tel:+918073428079" style={{ color: "inherit" }}>+91 80734 28079</a> /{" "}
                <a href="tel:+919590791849" style={{ color: "inherit" }}>+91 95907 91849</a>
              </span>
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
            href="https://www.google.com/maps/place/sri+someshwara+silk+sarees/data=!4m2!3m1!1s0x3bae1956a0610233:0x8428be60cdc82448?sa=X&ved=1t:242&ictx=111"
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
            Locate Weaving Center on Google Maps
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
