import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShoppingBag, Sparkles, Award, CheckCircle, Calculator, ChevronRight, HelpCircle } from "lucide-react";

// Import images via ES modules so Vite resolves them at build time (no blank images)
import saree1Img from "../assets/products/saree-1.png";
import saree2Img from "../assets/products/saree-2.png";
import saree3Img from "../assets/products/saree-3.png";
import bannerWedding from "../assets/banners/wedding.png";
import bannerFestive from "../assets/banners/festive.png";
import bannerWeaver from "../assets/banners/weaver.png";
import introHeroImg from "../assets/banners/intro-hero.png";

export default function Home({ setCurrentTab, addToCart, products }) {
  // Opening Intro Animation State
  const [showIntro, setShowIntro] = useState(true);

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Drape Preview Simulator State
  const [selectedDrapeColor, setSelectedDrapeColor] = useState("Maroon");

  // Interactive Weaving Stepper State
  const [activeStep, setActiveStep] = useState(0);

  // B2B Pricing Calculator State
  const [calcQty, setCalcQty] = useState(30);
  const [calcWeave, setCalcWeave] = useState("Gadwal Semi Silk");
  useEffect(() => {
    // Graceful intro — hold for 4.5 seconds so the saree glides slowly and text is readable
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Hero Carousel Slides
  const heroSlides = [
    {
      title: "Exquisite Gadwal Semi Silk Sarees",
      subtitle: "Traditional Weaver Redefined for the Modern Woman",
      image: bannerWedding,
      tag: "Wedding Lookbook 2026",
      accent: "var(--accent-gold)"
    },
    {
      title: "Vibrant Gadwal Semi Sicco Sarees",
      subtitle: "Comfort Meets Craftsmanship in Every Single Thread",
      image: bannerFestive,
      tag: "Festive Collection",
      accent: "#f43f5e"
    },
    {
      title: "Master Weaving Traditions",
      subtitle: "Preserving Ancestral Loom Traditions for Contemporary Drape Elegance",
      image: bannerWeaver,
      tag: "Loom Heritage",
      accent: "#10b981"
    }
  ];

  // Saree Drape Preview configurations
  const drapeModels = {
    Maroon: {
      name: "Classic Crimson Red Saree",
      image: saree1Img,
      border: "Gold Zari",
      pallu: "Rich Brocade Checks",
      price: 3499
    },
    "Emerald Green": {
      name: "Emerald Green Sicco Saree",
      image: saree2Img,
      border: "Peacock Blue Silk",
      pallu: "Teardrop Butti Motif",
      price: 2799
    },
    "Mustard Gold": {
      name: "Heritage Mustard Gold Saree",
      image: saree3Img,
      border: "Dark Pink Border",
      pallu: "Traditional Temple Join",
      price: 3899
    }
  };

  // Stepper steps for Weaving Process
  const weavingSteps = [
    {
      title: "1. Thread Selection",
      description: "We pick high-grade silk fibers for warp and fine cotton warp for weft (Semi Cicco ratio) to create a soft, breathable yet premium texture.",
      icon: "🧵"
    },
    {
      title: "2. Border Zari Preparation",
      description: "Pure metallic gold zari threads are wound onto traditional wooden spindles to prepare for the heavy contrast borders.",
      icon: "✨"
    },
    {
      title: "3. Loom Weft Interlocking",
      description: "Our master loom weavers manually adjust the warp tension, joining the body thread to the border thread using temple knots.",
      icon: "⚙️"
    },
    {
      title: "4. Knotting & Quality Audit",
      description: "Loose fringe tassels are knotted by hand. The saree undergoes inspection under direct light to check for weave spacing faults.",
      icon: "🔍"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.slice(0, 4);

  // Live Calculator Calculation
  const getCalculatedQuote = () => {
    const baseRate = calcWeave === "Gadwal Semi Silk" ? 3500 : 2800;

    // Tier pricing discount rules
    let discountPercent = 0.05; // 10-14 items
    if (calcQty >= 15 && calcQty < 30) discountPercent = 0.15;
    else if (calcQty >= 30 && calcQty < 50) discountPercent = 0.25;
    else if (calcQty >= 50) discountPercent = 0.35; // Factory Direct

    const subtotal = baseRate * calcQty;
    const discount = subtotal * discountPercent;
    const total = subtotal - discount;
    const deposit = total * 0.30; // 30% advance
    const timeEstimate = Math.ceil(calcQty / 3) + 5; // Weaving days

    return {
      subtotal,
      discountPercent: Math.round(discountPercent * 100),
      discount,
      total,
      deposit,
      timeEstimate
    };
  };

  const quote = getCalculatedQuote();

  // Animation constants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "100px", overflowX: "hidden" }}>

      {/* 0. LUXURY BRAND INTRO — MINIMAL ELEGANCE */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "#0a0304",
              zIndex: 999999,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden"
            }}
          >
            {/* Animated Saree Background - Slow zoom/drape drift */}
            <motion.img
              src={introHeroImg}
              alt="Sri Someshwara Saree Loom Background"
              initial={{ scale: 1.25, y: 15, opacity: 0 }}
              animate={{ scale: 1.05, y: 0, opacity: 0.35 }}
              transition={{ duration: 4.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 1,
                pointerEvents: "none"
              }}
            />

            {/* Soft gradient/vignette overlay to keep text legible */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "radial-gradient(circle at center, rgba(10,3,4,0.45) 0%, rgba(10,3,4,0.95) 90%)",
              zIndex: 2,
              pointerEvents: "none"
            }} />

            {/* Soft golden ambient glow at center */}
            <div style={{
              position: "absolute",
              width: "500px",
              height: "500px",
              background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: 3
            }} />

            {/* Animated golden particles */}
            <div className="intro-particles" style={{ zIndex: 4 }} />

            {/* ——— Top ornamental line ——— */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "60px", opacity: 0.4 }}
              transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
              style={{
                height: "1px",
                background: "var(--accent-gold)",
                marginBottom: "28px",
                position: "relative",
                zIndex: 5
              }}
            />

            {/* ——— Golden ✦ ornament ——— */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -90 }}
              animate={{ opacity: 0.7, scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 1.0, type: "spring", stiffness: 80 }}
              style={{
                color: "var(--accent-gold)",
                fontSize: "18px",
                marginBottom: "24px",
                position: "relative",
                zIndex: 5
              }}
            >
              ✦
            </motion.div>

            {/* ——— Brand Name ——— */}
            <motion.h1
              initial={{ opacity: 0, y: 30, letterSpacing: "12px" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "6px" }}
              transition={{ delay: 0.8, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "48px",
                color: "#ffffff",
                textAlign: "center",
                lineHeight: "1.2",
                fontWeight: "400",
                position: "relative",
                zIndex: 5
              }}
            >
              Sri Someshwara
            </motion.h1>

            {/* ——— "Silk Sarees" in gold ——— */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 1.0, ease: "easeOut" }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "28px",
                color: "var(--accent-gold)",
                fontWeight: "400",
                letterSpacing: "8px",
                textTransform: "uppercase",
                marginTop: "4px",
                position: "relative",
                zIndex: 5
              }}
            >
              Silk Sarees
            </motion.h2>

            {/* ——— Expanding gold divider ——— */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "140px" }}
              transition={{ delay: 2.0, duration: 1.0, ease: "easeInOut" }}
              style={{
                height: "1px",
                background: "linear-gradient(90deg, transparent, var(--accent-gold), transparent)",
                margin: "28px 0",
                position: "relative",
                zIndex: 5
              }}
            />

            {/* ——— Tagline ——— */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 2.5, duration: 1.0 }}
              style={{
                color: "rgba(250,247,240,0.7)",
                fontSize: "12px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                fontWeight: "500",
                position: "relative",
                zIndex: 5
              }}
            >
              Bengaluru &nbsp;·&nbsp; Heritage Handlooms &nbsp;·&nbsp; Est. Tradition
            </motion.p>

            {/* ——— Bottom ornamental line ——— */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "60px", opacity: 0.4 }}
              transition={{ delay: 2.8, duration: 0.8, ease: "easeOut" }}
              style={{
                height: "1px",
                background: "var(--accent-gold)",
                marginTop: "28px",
                position: "relative",
                zIndex: 5
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO CAROUSEL BANNER (Ken Burns & Smooth Text Fade) */}
      <div className="hero-banner" style={{
        position: "relative",
        height: "650px",
        overflow: "hidden",
        backgroundColor: "#171011"
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center"
            }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, rgba(30,10,13,0.98) 25%, rgba(74,14,21,0.65) 55%, rgba(0,0,0,0.1) 100%)",
              zIndex: 2
            }} />

            <motion.img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              initial={{ scale: 1.15, x: 20 }}
              animate={{ scale: 1.0, x: 0 }}
              transition={{ duration: 6, ease: "easeOut" }}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "55%",
                height: "100%",
                objectFit: "cover",
                zIndex: 1
              }}
            />

            <div className="container" style={{ position: "relative", zIndex: 3, color: "var(--bg-cream)", width: "100%" }}>
              <div style={{ maxWidth: "680px" }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "rgba(212, 175, 55, 0.15)",
                    border: "1px solid rgba(212, 175, 55, 0.35)",
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full)",
                    marginBottom: "24px"
                  }}
                >
                  <Sparkles size={14} style={{ color: "var(--accent-gold)" }} />
                  <span style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--accent-gold)" }}>
                    {heroSlides[currentSlide].tag}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 70 }}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "56px",
                    color: "#ffffff",
                    marginBottom: "20px",
                    lineHeight: "1.15",
                    textShadow: "0 2px 12px rgba(0,0,0,0.6)"
                  }}
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{ fontSize: "19px", color: "var(--bg-cream)", marginBottom: "40px", lineHeight: "1.6" }}
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
                >
                  <a href="#/shop" onClick={() => setCurrentTab("shop")} className="btn btn-gold" style={{ padding: "14px 36px" }}>
                    Explore Handlooms <ArrowRight size={16} />
                  </a>
                  <a href="#/about" onClick={() => setCurrentTab("about")} className="btn btn-outline" style={{ borderColor: "#ffffff", color: "#ffffff" }}>
                    BK Weaving Legacy
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 1.5 LATEST MOTION SHOWCASE: THE UNFOLDING SAREE */}
      <section style={{
        position: "relative",
        backgroundColor: "#210508",
        padding: "60px 0",
        overflow: "hidden",
        borderTop: "2px solid var(--accent-gold)",
        borderBottom: "2px solid var(--accent-gold)"
      }}>
        {/* Background weave thread layers */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: "radial-gradient(circle, var(--accent-gold) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "40px", alignItems: "center" }} className="stepper-layout">

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", color: "var(--bg-cream)" }}>
              <span style={{ color: "var(--accent-gold)", fontWeight: "800", textTransform: "uppercase", fontSize: "11px", letterSpacing: "2px" }}>
                Signature Handloom Motion
              </span>
              <h2 style={{ fontSize: "36px", color: "#ffffff", fontFamily: "'Playfair Display', serif" }}>
                The Sliding Loom Showcase
              </h2>
              <p style={{ color: "rgba(250, 247, 240, 0.8)", fontSize: "14px", lineHeight: "1.6" }}>
                Watch our classic weave glide into place. To mimic the physical movement of the handloom shuttle, this saree slides across the loom track from left to right as you browse.
              </p>

              <div style={{ display: "flex", gap: "24px", marginTop: "10px" }}>
                <div>
                  <h4 style={{ color: "var(--accent-gold)", fontSize: "20px", fontWeight: "800" }}>100%</h4>
                  <p style={{ fontSize: "11px", color: "rgba(250, 247, 240, 0.7)" }}>Genuine Gadwal Semi Silk</p>
                </div>
                <div style={{ borderLeft: "1px solid rgba(212,175,55,0.2)", paddingLeft: "24px" }}>
                  <h4 style={{ color: "var(--accent-gold)", fontSize: "20px", fontWeight: "800" }}>BK Weave</h4>
                  <p style={{ fontSize: "11px", color: "rgba(250, 247, 240, 0.7)" }}>Authentic Bengaluru Shuttle</p>
                </div>
              </div>
            </div>

            <div style={{
              position: "relative",
              height: "300px",
              overflow: "hidden",
              borderRadius: "var(--radius-md)",
              border: "2px solid var(--accent-gold)",
              boxShadow: "var(--shadow-lg)",
              backgroundColor: "rgba(74, 14, 21, 0.3)"
            }}>
              {/* Sliding saree image container */}
              <motion.div
                initial={{ x: -80, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  type: "spring",
                  stiffness: 40,
                  damping: 15,
                  duration: 1.5
                }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%"
                }}
              >
                <img
                  src={saree3Img}
                  alt="Mustard Gold Heritage Saree"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />

                {/* Floating specifications label */}
                <div style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  right: "20px",
                  backgroundColor: "rgba(30, 10, 13, 0.85)",
                  border: "1px solid var(--accent-gold)",
                  borderRadius: "var(--radius-sm)",
                  padding: "12px",
                  color: "#ffffff"
                }}>
                  <span style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: "800", textTransform: "uppercase" }}>Heritage Collection</span>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", margin: "2px 0" }}>Mustard & Pink Heritage Saree</h4>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>Gold zari shuttle weaves</p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ADVANCED INTERACTIVE DRAPE SIMULATOR */}
      <section className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: "54px",
            alignItems: "center"
          }}
          className="drape-simulator-layout"
        >
          {/* Saree Drape Previewer */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <span style={{ color: "var(--accent-gold-hover)", fontWeight: "800", textTransform: "uppercase", fontSize: "12px", letterSpacing: "1.5px" }} className="dark-gold-text">
              Virtual Lookbook Drape Preview
            </span>
            <h2 style={{ fontSize: "38px" }}>Visualize the Fall & Pallu</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.6" }}>
              Gadwal sarees are famously draped to show the high contrast borders. Select a color swatch below to preview the fall, border details, and pallu designs in real-time.
            </p>

            {/* Swatch Selector */}
            <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
              {Object.keys(drapeModels).map((colorName) => (
                <button
                  key={colorName}
                  onClick={() => setSelectedDrapeColor(colorName)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "var(--radius-full)",
                    border: selectedDrapeColor === colorName ? "2px solid var(--primary-maroon)" : "1px solid var(--border-light)",
                    backgroundColor: selectedDrapeColor === colorName ? "var(--primary-maroon)" : "var(--bg-white)",
                    color: selectedDrapeColor === colorName ? "var(--bg-cream)" : "var(--text-dark)",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "13px",
                    transition: "all var(--transition-fast)"
                  }}
                  className="swatch-btn"
                >
                  {colorName}
                </button>
              ))}
            </div>

            {/* Details Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDrapeColor}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{
                  backgroundColor: "rgba(74,14,21,0.03)",
                  border: "1px solid var(--border-gold)",
                  borderRadius: "var(--radius-md)",
                  padding: "24px",
                  marginTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
                className="drape-info-card"
              >
                <h4 style={{ fontSize: "18px", color: "var(--primary-maroon)" }} className="dark-gold-text">
                  {drapeModels[selectedDrapeColor].name}
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px" }}>
                  <div><strong>Border type:</strong> {drapeModels[selectedDrapeColor].border}</div>
                  <div><strong>Pallu work:</strong> {drapeModels[selectedDrapeColor].pallu}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-light)", paddingTop: "12px", marginTop: "8px" }}>
                  <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--primary-maroon)" }} className="price-tag">
                    ₹{drapeModels[selectedDrapeColor].price}
                  </span>
                  <button
                    onClick={() => {
                      const prod = products.find(p => p.name.includes(selectedDrapeColor));
                      if (prod) addToCart(prod, 1);
                    }}
                    className="btn btn-primary"
                    style={{ padding: "8px 16px", fontSize: "13px", minHeight: "auto" }}
                  >
                    Add Saree
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Graphic Drape Container */}
          <div style={{
            position: "relative",
            height: "480px",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "3px solid var(--accent-gold)",
            boxShadow: "var(--shadow-lg)"
          }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedDrapeColor}
                src={drapeModels[selectedDrapeColor].image}
                alt={drapeModels[selectedDrapeColor].name}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </AnimatePresence>
            <div style={{
              position: "absolute",
              bottom: "16px",
              left: "16px",
              backgroundColor: "rgba(74, 14, 21, 0.8)",
              color: "#ffffff",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: "12px",
              fontWeight: "600"
            }}>
              Interactive model preview
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. SAREE CATALOG COLLECTIONS GRID */}
      <section className="container">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ color: "var(--accent-gold-hover)", fontWeight: "800", textTransform: "uppercase", fontSize: "12px", letterSpacing: "1.5px" }} className="dark-gold-text">
            Handwoven Classics
          </span>
          <h2 style={{ fontSize: "38px" }}>Premium Catalog</h2>
          <div style={{ width: "80px", height: "3px", backgroundColor: "var(--accent-gold)", margin: "12px auto" }} />
        </div>

        <div className="product-grid" style={{ marginBottom: "40px" }}>
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -8 }}
              className="glass-card-gold"
              style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
            >
              <div style={{ position: "relative", overflow: "hidden", height: "340px" }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
                <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                  <span className="badge badge-gold" style={{ backgroundColor: "var(--primary-maroon)", color: "var(--accent-gold)" }}>
                    {product.weave}
                  </span>
                </div>
              </div>

              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}>
                <h3 style={{ fontSize: "17px", fontFamily: "inherit", fontWeight: "700" }}>{product.name}</h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", flexGrow: 1 }}>{product.description.substring(0, 95)}...</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-light)", paddingTop: "12px", marginTop: "12px" }}>
                  <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--primary-maroon)" }} className="price-tag">₹{product.price}</span>
                  <button onClick={() => addToCart(product, 1)} className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "12px", minHeight: "auto" }}>
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. WEAVING PROCESS INTERACTIVE STEPPER */}
      <section style={{ backgroundColor: "rgba(74, 14, 21, 0.02)", padding: "90px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "var(--accent-gold-hover)", fontWeight: "800", textTransform: "uppercase", fontSize: "12px" }} className="dark-gold-text">
              How We Loom Your Sarees
            </span>
            <h2 style={{ fontSize: "38px" }}>Traditional Weaving Process</h2>
            <div style={{ width: "60px", height: "3px", backgroundColor: "var(--accent-gold)", margin: "12px auto" }} />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "48px",
            alignItems: "center"
          }} className="stepper-layout">

            {/* Steps buttons list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {weavingSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    padding: "20px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid",
                    borderColor: activeStep === idx ? "var(--accent-gold)" : "var(--border-light)",
                    backgroundColor: activeStep === idx ? "var(--bg-white)" : "transparent",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)"
                  }}
                  className="step-btn"
                >
                  <span style={{ fontSize: "28px" }}>{step.icon}</span>
                  <div>
                    <h4 style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: activeStep === idx ? "var(--primary-maroon)" : "var(--text-dark)"
                    }} className="dark-gold-text">
                      {step.title}
                    </h4>
                    <p style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      marginTop: "4px",
                      display: activeStep === idx ? "block" : "none"
                    }}>
                      {step.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Simulated Loom Showcase Box */}
            <div className="glass-card" style={{
              padding: "40px",
              height: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              border: "2px solid var(--accent-gold)",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Floating background decorative pattern */}
              <div style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                fontSize: "180px",
                opacity: 0.05,
                pointerEvents: "none"
              }}>
                🕸️
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}
                >
                  <div style={{
                    fontSize: "72px",
                    animation: "pulse 2s infinite"
                  }}>
                    {weavingSteps[activeStep].icon}
                  </div>

                  <h3 style={{ fontSize: "24px", color: "var(--primary-maroon)" }} className="dark-gold-text">
                    {weavingSteps[activeStep].title}
                  </h3>

                  <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6", maxWidth: "340px" }}>
                    {weavingSteps[activeStep].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE B2B WHOLESALE PRICING CALCULATOR */}
      <section className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          style={{
            background: "linear-gradient(135deg, var(--bg-white), var(--bg-cream))",
            border: "2px solid var(--accent-gold)",
            borderRadius: "var(--radius-lg)",
            padding: "48px",
            boxShadow: "var(--shadow-lg)"
          }}
          className="calculator-container-card"
        >
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "32px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <Calculator size={28} style={{ color: "var(--accent-gold)" }} /> Live B2B Loom Calculator
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "6px" }}>
              Select saree weave and volume to check our direct loom cost estimates.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "48px"
          }} className="calc-layout">

            {/* Input selectors */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="form-group">
                <label className="form-label">Select Weave Fabric Type</label>
                <select
                  className="form-input"
                  value={calcWeave}
                  onChange={(e) => setCalcWeave(e.target.value)}
                  style={{ cursor: "pointer" }}
                >
                  <option value="Gadwal Semi Silk">Gadwal Semi Silk (Base: ₹3,500/pc)</option>
                  <option value="Gadwal Semi Cicco">Gadwal Semi Cicco (Base: ₹2,800/pc)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Saree Quantity Required: <strong>{calcQty} pieces</strong></label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={calcQty}
                  onChange={(e) => setCalcQty(parseInt(e.target.value))}
                  style={{ accentColor: "var(--primary-maroon)", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)" }}>
                  <span>10 Sarees (Sample Lot)</span>
                  <span>100 Sarees (High volume)</span>
                </div>
              </div>

              {/* Discount scale indicator */}
              <div style={{
                backgroundColor: "rgba(214,175,55,0.05)",
                border: "1px solid var(--border-gold)",
                borderRadius: "var(--radius-sm)",
                padding: "16px",
                fontSize: "12px",
                lineHeight: "1.6"
              }}>
                <strong>Wholesale volume discount tiers:</strong><br />
                • 10 - 14 pieces: <strong>5% Off</strong><br />
                • 15 - 29 pieces: <strong>15% Off</strong> (Sample Tier)<br />
                • 30 - 49 pieces: <strong>25% Off</strong> (Standard Partner)<br />
                • 50+ pieces: <strong>35% Off</strong> (Factory Direct Loom Support)
              </div>
            </div>

            {/* Calculations Output */}
            <div style={{
              backgroundColor: "var(--primary-maroon)",
              color: "var(--bg-cream)",
              padding: "36px",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)"
            }} className="calc-output-box">
              <h4 style={{ color: "var(--accent-gold)", fontSize: "18px", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: "10px" }}>Cost Breakdown</h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Loom Base Total:</span>
                  <span>₹{quote.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-gold)", fontWeight: "600" }}>
                  <span>Volume Discount ({quote.discountPercent}%):</span>
                  <span>- ₹{quote.discount.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed rgba(255,255,255,0.1)", paddingTop: "12px", fontWeight: "700" }}>
                  <span>Final Bulk Price:</span>
                  <span style={{ fontSize: "16px" }}>₹{quote.total.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed rgba(255,255,255,0.1)", paddingTop: "12px", fontSize: "13px", opacity: 0.8 }}>
                  <span>30% Advance Deposit Required:</span>
                  <span>₹{quote.deposit.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", opacity: 0.8 }}>
                  <span>Estimated Loom Weaving Duration:</span>
                  <span>~ {quote.timeEstimate} Days</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentTab("b2b");
                  window.location.hash = "#/b2b";
                }}
                className="btn btn-gold"
                style={{ width: "100%", padding: "14px", marginTop: "10px", fontWeight: "700" }}
              >
                Order Direct from Looms <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 6. GLOWING B2B WHOLESALE BANNER */}
      <motion.section
        className="container"
        style={{ marginBottom: "80px" }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div style={{
          background: "linear-gradient(135deg, var(--primary-maroon), #240508)",
          borderRadius: "var(--radius-lg)",
          border: "2px solid var(--accent-gold)",
          padding: "54px 48px",
          color: "var(--bg-cream)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "36px",
          boxShadow: "var(--shadow-lg)"
        }} className="b2b-cta-card">
          <div style={{ maxWidth: "700px" }}>
            <span style={{
              color: "var(--accent-gold)",
              fontWeight: "800",
              fontSize: "12px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "8px"
            }}>
              Partnerships & Bulk Deals
            </span>
            <h2 style={{
              color: "#ffffff",
              fontSize: "36px",
              marginBottom: "16px",
              lineHeight: "1.2"
            }}>
              Wholesale Discounts for Clothing Shops
            </h2>
            <p style={{
              fontSize: "16px",
              opacity: "0.9",
              lineHeight: "1.6"
            }}>
              Connect with Bengaluru's top Gadwal manufacturer. We provide special tier discount brackets (up to 25% Off) and custom layout weaves for boutiques across India. Submit a bulk request or log in for rates.
            </p>
          </div>
          <div>
            <motion.a
              href="#/b2b"
              onClick={() => setCurrentTab("b2b")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-gold"
              style={{
                padding: "16px 40px",
                fontSize: "16px",
                fontWeight: "700",
                boxShadow: "var(--shadow-md)"
              }}
            >
              Request Trade Access
            </motion.a>
          </div>
        </div>
      </motion.section>

      <style>{`
        .dark .dark-gold-text {
          color: var(--accent-gold) !important;
        }
        .dark .price-tag {
          color: var(--accent-gold) !important;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @media (max-width: 900px) {
          .hero-banner-image {
            width: 100% !important;
            opacity: 0.3 !important;
          }
          .drape-simulator-layout,
          .stepper-layout,
          .calc-layout {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .b2b-cta-card {
            padding: 36px 24px !important;
            text-align: center;
            justify-content: center !important;
          }
          .b2b-cta-card a {
            width: 100%;
          }
          .calculator-container-card {
            padding: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
