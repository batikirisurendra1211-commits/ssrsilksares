import React from "react";
import { Award, ShieldCheck, Heart, UserCheck } from "lucide-react";
import saree2Img from "../assets/products/saree-2.png";
import saree3Img from "../assets/products/saree-3.png";

export default function About({ setCurrentTab }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "60px", paddingTop: "40px" }}>

      {/* Brand Story Section */}
      <section className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "48px",
          alignItems: "center"
        }}>
          {/* Legacy details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <span style={{
              color: "var(--accent-gold)",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              fontSize: "12px"
            }}>
              Our Legacy & Heritage
            </span>
            <h1 style={{ fontSize: "40px" }}>The Craft of Sri Someshwara Silk Sarees</h1>
            <div style={{
              width: "60px",
              height: "3px",
              backgroundColor: "var(--accent-gold)"
            }} />
            <p style={{ fontSize: "16px", lineHeight: "1.7", color: "var(--text-dark)" }}>
              Founded in Yelahanka, Bengaluru by master craftsperson <strong>Store Founder</strong>, Sri Someshwara Silk Sarees (famously known as <strong>SS Silks</strong>) was born out of a desire to preserve the glorious weaving patterns of Gadwal sarees while introducing lightweight, durable blends.
            </p>
            <p style={{ fontSize: "15px", lineHeight: "1.7", color: "var(--text-muted)" }}>
              Gadwal sarees are historic treasures, globally celebrated for their contrasting borders and silk-cotton intersections. At SS Silks, we specialize in <strong>Gadwal Semi Silk</strong> and <strong>Gadwal Semi Cicco</strong> (cotton-silk warp/wefts). We design and loom each saree with meticulous dedication, ensuring that our customers experience premium luxury and absolute comfort, whether they are celebrating a wedding, a festive occasion, or wearing it daily.
            </p>
            <a
              href="#/shop"
              onClick={() => setCurrentTab("shop")}
              className="btn btn-primary"
              style={{ alignSelf: "flex-start", marginTop: "8px" }}
            >
              Explore Our Weaves
            </a>
          </div>

          {/* Legacy Imagery (Visual anchor) */}
          <div style={{
            position: "relative",
            height: "450px",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "2px solid var(--accent-gold)"
          }}>
            {/* Soft decorative blur */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(74, 14, 21, 0.05)"
            }} />
            {/* Reuse generated image 3 for design consistence */}
            <img
              src={saree3Img}
              alt="Handloom Weaving Loom"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </div>
        </div>
      </section>

      {/* Meet the Founder Block */}
      <section style={{ backgroundColor: "rgba(74,14,21,0.02)", padding: "80px 0" }}>
        <div className="container" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "48px",
          alignItems: "center"
        }}>
          {/* Saree Loom Image (Reuse generated image 2) */}
          <div style={{
            height: "400px",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "1px solid var(--border-gold)",
            order: window.innerWidth > 768 ? 1 : 2
          }} className="founder-img-container">
            <img
              src={saree2Img}
              alt="Store Founder"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </div>

          {/* Founder description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", order: 1 }}>
            <span style={{ color: "var(--accent-gold)", fontWeight: "700" }}>Meet Our Founder</span>
            <h2 style={{ fontSize: "32px" }}>Store Founder</h2>
            <p style={{ fontStyle: "italic", color: "var(--primary-maroon)", fontWeight: "600" }} className="dark-gold-text">
              "A saree is not just a piece of fabric; it is a canvas of Bengaluru's rich weaving heritage."
            </p>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
              With over three decades of design expertise, our founder oversees our entire production layout in Markandaya Nagar, Agrahara Layout. By personally inspecting the zari quality, thread counts, and border motifs, he ensures that the legacy of South Indian handlooms remains vibrant, authentic, and accessible.
            </p>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
              His vision guides our dual B2C and B2B wholesale services, connecting independent boutique owners across India with our local Bengaluru looms to offer direct manufacturer rates and reliable product flows.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="container" style={{ marginBottom: "60px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "32px" }}>Our Weaving Values</h2>
          <div style={{ width: "60px", height: "3px", backgroundColor: "var(--accent-gold)", margin: "12px auto" }} />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "30px"
        }}>
          <div className="glass-card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <Award size={36} style={{ color: "var(--accent-gold)" }} />
            <h3 style={{ fontSize: "20px" }}>Exquisite Integrity</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
              We never compromise on thread blends. Our semi-silk sarees utilize premium synthetic silk that closely mirrors the visual and textural luxury of pure mulberry silk.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <ShieldCheck size={36} style={{ color: "var(--accent-gold)" }} />
            <h3 style={{ fontSize: "20px" }}>Fair Trade Support</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
              We support local loom operators and assistant weavers in Bengaluru, ensuring fair wages, safe working hours, and respect for their craftsmanship.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <Heart size={36} style={{ color: "var(--accent-gold)" }} />
            <h3 style={{ fontSize: "20px" }}>Customer Obsession</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
              From customer order requests to online support and parcel tracking, our team is directly involved to assist you.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .dark .dark-gold-text {
          color: var(--accent-gold) !important;
        }
        @media (max-width: 768px) {
          .founder-img-container {
            order: 2 !important;
            height: 300px !important;
          }
        }
      `}</style>
    </div>
  );
}
