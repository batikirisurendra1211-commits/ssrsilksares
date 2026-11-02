import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  Award, 
  CheckCircle, 
  Calculator, 
  ChevronRight, 
  ChevronLeft,
  HelpCircle, 
  Play, 
  Film, 
  ExternalLink,
  Star,
  ShieldCheck,
  Eye,
  PhoneCall,
  X as CloseIcon,
  Plus
} from "lucide-react";

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.3 1.12.3 3.48.3 3.48s0 2.36-.3 3.48a2.01 2.01 0 0 1-1.415 1.42c-1.12.3-5.285.3-6.11.335h-.09c-.823-.003-4.987-.03-6.11-.335a2.01 2.01 0 0 1-1.415-1.42c-.3-1.12-.3-3.48-.3-3.48s0-2.36.3-3.48a2.01 2.01 0 0 1 1.415-1.42c1.122-.3 5.285-.3 6.11-.335zM6.5 5.5v5l4.5-2.5z" />
  </svg>
);

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
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  // Drape Preview Simulator State
  const [selectedDrapeColor, setSelectedDrapeColor] = useState("Maroon");

  // Interactive Weaving Stepper State
  const [activeStep, setActiveStep] = useState(0);

  // B2B Pricing Calculator State
  const [calcQty, setCalcQty] = useState(30);
  const [calcWeave, setCalcWeave] = useState("Gadwal Semi Silk");

  // Luxury Video & Reels Carousel Suite State
  const videoCarouselRef = useRef(null);
  const [activeMediaFilter, setActiveMediaFilter] = useState("all");
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // 8 Official Videos & Reels from @SSSilksarees & @sssilksarees49
  const officialMediaList = [
    {
      id: "Tt8khf0Atco",
      type: "youtube",
      title: "Premium Semi Sico Gadwal Sarees Collection",
      tag: "Pitloom Direct",
      badge: "Featured Collection",
      views: "145K Views",
      desc: "Live pitloom showcase of authentic contrast border Gadwal sarees from Bengaluru looms",
      channel: "@SSSilksarees",
      channelUrl: "https://www.youtube.com/@SSSilksarees",
      liveUrl: "https://www.youtube.com/watch?v=Tt8khf0Atco",
      thumb: "https://i.ytimg.com/vi/Tt8khf0Atco/hqdefault.jpg"
    },
    {
      id: "96Gz5ASxdc4",
      type: "instagram",
      title: "No. 1 Premium Semi Gadwal Sarees Weaving",
      tag: "Butta Kempanna Group",
      badge: "Viral Reel",
      views: "185K Views",
      desc: "Generational pitloom demonstration of authentic Gadwal sarees in Markandaya Nagar",
      channel: "@sssilksarees49",
      channelUrl: "https://www.instagram.com/sssilksarees49/",
      liveUrl: "https://www.instagram.com/sssilksarees49/",
      thumb: "https://i.ytimg.com/vi/96Gz5ASxdc4/hqdefault.jpg"
    },
    {
      id: "l_p8mIZGmQY",
      type: "youtube",
      title: "Semi Gadwal Sarees Factory & Loom Tour",
      tag: "Factory Manufacturing",
      badge: "Weaving Process",
      views: "210K Views",
      desc: "Master generational weavers crafting pure zari temple joins at Markandaya Nagar",
      channel: "@SSSilksarees",
      channelUrl: "https://www.youtube.com/@SSSilksarees",
      liveUrl: "https://www.youtube.com/watch?v=l_p8mIZGmQY",
      thumb: "https://i.ytimg.com/vi/l_p8mIZGmQY/hqdefault.jpg"
    },
    {
      id: "E7q9q6NaweA",
      type: "instagram",
      title: "Manufacturer Premium Semi Sico Gadwal Sarees",
      tag: "Direct Manufacturer",
      badge: "Contrast Temple Knot",
      views: "240K Views",
      desc: "Traditional contrast border weaving with shimmering gold zari pallu",
      channel: "@sssilksarees49",
      channelUrl: "https://www.instagram.com/sssilksarees49/",
      liveUrl: "https://www.instagram.com/sssilksarees49/",
      thumb: "https://i.ytimg.com/vi/E7q9q6NaweA/hqdefault.jpg"
    },
    {
      id: "jbk-pzWCEKs",
      type: "youtube",
      title: "Semi Gadwal Sarees Bulk Orders & Factory Dispatch",
      tag: "Wholesale Lots",
      badge: "B2B Dispatch",
      views: "190K Views",
      desc: "Insured wholesale lots dispatch across India for boutiques and bridal retail",
      channel: "@SSSilksarees",
      channelUrl: "https://www.youtube.com/@SSSilksarees",
      liveUrl: "https://www.youtube.com/watch?v=jbk-pzWCEKs",
      thumb: "https://i.ytimg.com/vi/jbk-pzWCEKs/hqdefault.jpg"
    },
    {
      id: "QqmXxSsmyNo",
      type: "instagram",
      title: "Gadwal Sarees Manufacturer - Bangalore Studio",
      tag: "Loom Direct Rates",
      badge: "Factory Direct",
      views: "310K Views",
      desc: "Zero middleman markup, premium quality directly from our Yelahanka looms",
      channel: "@sssilksarees49",
      channelUrl: "https://www.instagram.com/sssilksarees49/",
      liveUrl: "https://www.instagram.com/sssilksarees49/",
      thumb: "https://i.ytimg.com/vi/QqmXxSsmyNo/hqdefault.jpg"
    },
    {
      id: "33glNPjexnM",
      type: "youtube",
      title: "Semi Sico Gadwal Sarees Direct Loom Walkthrough",
      tag: "Agrahara Layout Studio",
      badge: "Studio Collection",
      views: "165K Views",
      desc: "Vibrant color palette and fine silk-cotton body weave presentation",
      channel: "@SSSilksarees",
      channelUrl: "https://www.youtube.com/@SSSilksarees",
      liveUrl: "https://www.youtube.com/watch?v=33glNPjexnM",
      thumb: "https://i.ytimg.com/vi/33glNPjexnM/hqdefault.jpg"
    },
    {
      id: "IO2eJSQH3Cw",
      type: "instagram",
      title: "Handloom Shuttle & Pitloom Craftsmanship",
      tag: "Ancestral Weave",
      badge: "Artisan Heritage",
      views: "195K Views",
      desc: "Generational artisans weaving timeless heritage Gadwal sarees",
      channel: "@sssilksarees49",
      channelUrl: "https://www.instagram.com/sssilksarees49/",
      liveUrl: "https://www.instagram.com/sssilksarees49/",
      thumb: "https://i.ytimg.com/vi/IO2eJSQH3Cw/hqdefault.jpg"
    }
  ];

  const scrollVideoCarousel = (direction) => {
    if (videoCarouselRef.current) {
      const scrollOffset = direction === "next" ? 280 : -280;
      videoCarouselRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };

  const filteredMediaList = activeMediaFilter === "all"
    ? officialMediaList
    : officialMediaList.filter(m => m.type === activeMediaFilter);

  const currentMedia = officialMediaList[activeMediaIndex] || officialMediaList[0];

  useEffect(() => {
    // Lock body scroll during intro animation to prevent scrollbar flicker & white edge leak
    if (showIntro) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    // Graceful intro — hold for 4.5 seconds so the saree glides slowly and text is readable
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4500);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [showIntro]);

  // Ultra-Luxury Hero Carousel Slides
  const heroSlides = [
    {
      badge: "Bridal & Wedding Collection 2026",
      titlePrefix: "Exquisite Handcrafted",
      titleHighlight: "Gadwal Semi Silk",
      titleSuffix: "Sarees",
      subtitle: "Pitloom-woven with opulent metallic gold zari brocade, contrasting temple borders, and radiant pallus designed for life's most sacred moments.",
      image: bannerWedding,
      accent: "#D4AF37",
      trustPills: [
        "100% Pitloom Handcraft",
        "Tested Pure Zari",
        "Direct Bengaluru Looms"
      ],
      featuredSaree: {
        name: "Bridal Crimson Royal Gadwal Semi Silk",
        desc: "Rich contrast gold zari brocade with authentic temple join",
        price: 3499,
        mrp: 5299,
        rating: "4.9",
        reviews: "128 brides",
        tag: "Bridal Bestseller",
        badgeColor: "#d4af37"
      },
      ctaPrimary: "Explore Bridal Collection",
      ctaSecondary: "Loom Heritage Story",
      ctaPrimaryLink: "shop",
      ctaSecondaryLink: "about"
    },
    {
      badge: "Festive & Occasion Edit",
      titlePrefix: "Vibrant Handwoven",
      titleHighlight: "Gadwal Semi Sicco",
      titleSuffix: "Sarees",
      subtitle: "Featherlight comfort meets ancestral artistry. Breathable fine cotton-silk blend with festive contrast borders, tailored for effortless all-day grace.",
      image: bannerFestive,
      accent: "#f43f5e",
      trustPills: [
        "Featherlight Cotton-Silk Drape",
        "Radiant Contrast Pallu",
        "Zero Middleman Markups"
      ],
      featuredSaree: {
        name: "Festive Emerald Green Semi Sicco",
        desc: "Lightweight breathability with peacock blue contrast silk border",
        price: 2799,
        mrp: 4199,
        rating: "4.8",
        reviews: "215 reviews",
        tag: "Festive Favorite",
        badgeColor: "#10b981"
      },
      ctaPrimary: "Shop Festive Sicco",
      ctaSecondary: "Wholesale (B2B) Catalog",
      ctaPrimaryLink: "shop",
      ctaSecondaryLink: "b2b"
    },
    {
      badge: "Over 40 Years of Handloom Excellence",
      titlePrefix: "Preserving Ancestral",
      titleHighlight: "Master Loom Traditions",
      titleSuffix: "In Bengaluru",
      subtitle: "Woven by generational artisan families in Yelahanka. Authentic temple join knots, meticulous hand-spindle winding, and fair direct-to-customer pricing.",
      image: bannerWeaver,
      accent: "#10b981",
      trustPills: [
        "40+ Years Weaving Legacy",
        "Kuttu Interlocking Technique",
        "Direct Factory Pricing"
      ],
      featuredSaree: {
        name: "Heritage Mustard Gold Temple Weave",
        desc: "Dark pink contrast border with traditional temple knot join",
        price: 3899,
        mrp: 5899,
        rating: "5.0",
        reviews: "94 connoisseurs",
        tag: "Masterpiece Drape",
        badgeColor: "#d4af37"
      },
      ctaPrimary: "Our Weaving Story",
      ctaSecondary: "Custom Wholesale Orders",
      ctaPrimaryLink: "about",
      ctaSecondaryLink: "b2b"
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
    if (isHeroPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isHeroPaused, heroSlides.length]);

  const nextHeroSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevHeroSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

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
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#0a0304",
              zIndex: 999999,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              margin: 0,
              padding: 0
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
              animate={{ width: "80px", opacity: 0.6 }}
              transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
              style={{
                height: "1px",
                background: "linear-gradient(90deg, transparent, var(--accent-gold), transparent)",
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
              animate={{ width: "160px" }}
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

            {/* Skip Intro button */}
            <button
              onClick={() => setShowIntro(false)}
              style={{
                position: "absolute",
                top: "28px",
                right: "36px",
                background: "rgba(30, 8, 12, 0.75)",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                borderRadius: "9999px",
                padding: "8px 18px",
                color: "var(--accent-gold)",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "1px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                zIndex: 10,
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.4)"
              }}
            >
              <span>Skip Intro</span>
              <CloseIcon size={14} />
            </button>

            {/* ——— Bottom ornamental line ——— */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "80px", opacity: 0.6 }}
              transition={{ delay: 2.8, duration: 0.8, ease: "easeOut" }}
              style={{
                height: "1px",
                background: "linear-gradient(90deg, transparent, var(--accent-gold), transparent)",
                marginTop: "28px",
                position: "relative",
                zIndex: 5
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. ULTRA-LUXURY HERO CAROUSEL BANNER */}
      <div 
        className="hero-banner" 
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
        style={{
          position: "relative",
          minHeight: "720px",
          overflow: "hidden",
          backgroundColor: "#120407",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid rgba(212, 175, 55, 0.25)"
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: "easeInOut" }}
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
            {/* Full-bleed background saree photo with Ken Burns smooth zoom */}
            <motion.img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].titleHighlight}
              initial={{ scale: 1.08 }}
              animate={{ scale: 1.0 }}
              transition={{ duration: 7.5, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center right",
                zIndex: 1
              }}
            />

            {/* Cinematic Multi-Stop Luxury Gradient: seamless left-to-right blend */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, rgba(16,4,7,0.96) 0%, rgba(20,5,9,0.92) 36%, rgba(20,5,9,0.65) 65%, rgba(16,4,7,0.2) 100%)",
              zIndex: 2
            }} />

            {/* Subtle top & bottom vignette to enhance focus */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(180deg, rgba(16,4,7,0.65) 0%, transparent 18%, transparent 75%, rgba(16,4,7,0.85) 100%)",
              zIndex: 2,
              pointerEvents: "none"
            }} />

            {/* Ambient golden glow behind typography */}
            <div style={{
              position: "absolute",
              left: "10%",
              top: "25%",
              width: "500px",
              height: "500px",
              background: "radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(50px)",
              pointerEvents: "none",
              zIndex: 2
            }} />

            {/* Delicate golden accent lines at borders */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent)",
              zIndex: 3
            }} />
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent)",
              zIndex: 3
            }} />

            {/* Main Hero Content Container */}
            <div className="container" style={{ 
              position: "relative", 
              zIndex: 4, 
              paddingTop: "70px",
              paddingBottom: "120px",
              width: "100%" 
            }}>
              <div style={{ maxWidth: "780px" }}>
                {/* Regal Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(36px, 4.6vw, 60px)",
                    color: "#ffffff",
                    lineHeight: "1.15",
                    marginBottom: "20px",
                    fontWeight: "700",
                    textShadow: "0 4px 24px rgba(0,0,0,0.7)"
                  }}
                >
                  {heroSlides[currentSlide].titlePrefix} <br />
                  <span style={{
                    background: "linear-gradient(135deg, #FFF6D6 0%, #E8C86A 40%, #D4AF37 70%, #AA7C11 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block",
                    textShadow: "0 0 35px rgba(212,175,55,0.25)"
                  }}>
                    {heroSlides[currentSlide].titleHighlight}
                  </span>{" "}
                  {heroSlides[currentSlide].titleSuffix}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 0.92, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{ 
                    fontSize: "clamp(15px, 1.3vw, 18px)", 
                    color: "rgba(250, 247, 240, 0.92)", 
                    marginBottom: "26px", 
                    lineHeight: "1.65",
                    maxWidth: "640px",
                    textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                  }}
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>

                {/* Trust Micro-Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "36px"
                  }}
                >
                  {heroSlides[currentSlide].trustPills.map((pill, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#f5e6c8",
                        background: "rgba(35, 9, 15, 0.65)",
                        border: "1px solid rgba(212, 175, 55, 0.3)",
                        backdropFilter: "blur(6px)",
                        padding: "7px 16px",
                        borderRadius: "9999px"
                      }}
                    >
                      <CheckCircle size={13} style={{ color: "var(--accent-gold)" }} />
                      {pill}
                    </span>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}
                >
                  <a 
                    href={`#/${heroSlides[currentSlide].ctaPrimaryLink}`} 
                    onClick={() => setCurrentTab(heroSlides[currentSlide].ctaPrimaryLink)} 
                    className="btn btn-gold" 
                    style={{ 
                      padding: "16px 38px", 
                      fontSize: "15px", 
                      fontWeight: "700",
                      letterSpacing: "0.5px",
                      boxShadow: "0 8px 24px rgba(212, 175, 55, 0.35)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    <span>{heroSlides[currentSlide].ctaPrimary}</span>
                    <ArrowRight size={17} />
                  </a>

                  <a 
                    href={`#/${heroSlides[currentSlide].ctaSecondaryLink}`} 
                    onClick={() => setCurrentTab(heroSlides[currentSlide].ctaSecondaryLink)} 
                    style={{ 
                      padding: "15px 30px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#ffffff",
                      border: "1.5px solid rgba(255, 255, 255, 0.45)",
                      borderRadius: "9999px",
                      background: "rgba(255, 255, 255, 0.06)",
                      backdropFilter: "blur(8px)",
                      transition: "all 0.25s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent-gold)";
                      e.currentTarget.style.color = "var(--accent-gold)";
                      e.currentTarget.style.background = "rgba(212, 175, 55, 0.16)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.45)";
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                    }}
                  >
                    <span>{heroSlides[currentSlide].ctaSecondary}</span>
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Carousel Navigation Bar: Tabs with Progress Indicator + Arrow Controls */}
        <div style={{
          position: "absolute",
          bottom: "22px",
          left: 0,
          right: 0,
          zIndex: 10
        }}>
          <div className="container" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px"
          }}>
            {/* Slide Navigation Tabs */}
            <div className="hero-tabs-nav" style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              {heroSlides.map((slide, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      background: isActive ? "rgba(212, 175, 55, 0.18)" : "rgba(16, 4, 7, 0.55)",
                      border: isActive ? "1px solid rgba(212, 175, 55, 0.7)" : "1px solid rgba(255, 255, 255, 0.18)",
                      backdropFilter: "blur(12px)",
                      padding: "8px 16px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      textAlign: "left",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{
                        fontSize: "11px",
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: "700",
                        color: isActive ? "var(--accent-gold)" : "rgba(255, 255, 255, 0.6)"
                      }}>
                        0{idx + 1}
                      </span>
                      <span style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.65)"
                      }}>
                        {slide.titleHighlight}
                      </span>
                    </div>

                    {/* Animated Progress Line on Active Tab */}
                    {isActive && (
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 6.5, ease: "linear" }}
                        key={`progress-${currentSlide}`}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          height: "2px",
                          background: "linear-gradient(90deg, #d4af37, #fef08a)"
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Left / Right Arrow Buttons & Slide Counter */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{
                fontSize: "12px",
                color: "rgba(250, 247, 240, 0.75)",
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "1px"
              }}>
                0{currentSlide + 1} / 0{heroSlides.length}
              </span>
              <button
                onClick={prevHeroSlide}
                aria-label="Previous Slide"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "1px solid rgba(212, 175, 55, 0.4)",
                  background: "rgba(16, 4, 7, 0.65)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent-gold)";
                  e.currentTarget.style.background = "rgba(212, 175, 55, 0.25)";
                  e.currentTarget.style.color = "var(--accent-gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.4)";
                  e.currentTarget.style.background = "rgba(16, 4, 7, 0.65)";
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextHeroSlide}
                aria-label="Next Slide"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "1px solid rgba(212, 175, 55, 0.4)",
                  background: "rgba(16, 4, 7, 0.65)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent-gold)";
                  e.currentTarget.style.background = "rgba(212, 175, 55, 0.25)";
                  e.currentTarget.style.color = "var(--accent-gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.4)";
                  e.currentTarget.style.background = "rgba(16, 4, 7, 0.65)";
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1.5 LATEST MOTION SHOWCASE: THE UNFOLDING SAREE */}
      <section style={{
        position: "relative",
        backgroundColor: "#1c0407",
        padding: "100px 0",
        overflow: "hidden",
        borderTop: "2px solid var(--accent-gold)",
        borderBottom: "2px solid var(--accent-gold)",
        boxShadow: "inset 0 0 80px rgba(0,0,0,0.8)"
      }}>
        {/* Background weave thread layers with subtle aura glow */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.08,
          backgroundImage: "radial-gradient(circle, var(--accent-gold) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }} />

        {/* Ambient background light beam */}
        <div style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(225, 48, 108, 0.08) 40%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none"
        }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1.15fr", 
              gap: "60px", 
              alignItems: "center" 
            }} 
            className="stepper-layout"
          >

            {/* Left Column: Craftsmanship Story & Metrics */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", color: "var(--bg-cream)" }}>
              <span style={{ 
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--accent-gold)", 
                fontWeight: "800", 
                textTransform: "uppercase", 
                fontSize: "12px", 
                letterSpacing: "2.5px",
                backgroundColor: "rgba(212, 175, 55, 0.12)",
                padding: "8px 18px",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                width: "fit-content"
              }}>
                <Sparkles size={14} /> SIGNATURE PITLOOM MOTION
              </span>

              <h2 style={{ 
                fontSize: "44px", 
                color: "#ffffff", 
                fontFamily: "'Playfair Display', serif",
                lineHeight: "1.25"
              }}>
                The Sliding Loom <br />
                <span style={{
                  background: "linear-gradient(135deg, #FFF6D6 0%, #E8C86A 40%, #D4AF37 70%, #AA7C11 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  Heritage Showcase
                </span>
              </h2>

              <p style={{ color: "rgba(250, 247, 240, 0.85)", fontSize: "16px", lineHeight: "1.8", maxWidth: "560px" }}>
                Experience the rhythmic glide of our ancestral pitloom shuttle. As you browse, this heritage weave slides gracefully into focus, revealing authentic contrast borders, pure metallic gold zari, and meticulous hand-knot temple joinery woven directly in Yelahanka.
              </p>

              {/* 3 Luxury Craftsmanship Metric Cards */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(3, 1fr)", 
                gap: "16px", 
                marginTop: "12px" 
              }}>
                <div style={{
                  backgroundColor: "rgba(30, 8, 14, 0.75)",
                  border: "1px solid rgba(212, 175, 55, 0.25)",
                  borderRadius: "12px",
                  padding: "16px 14px",
                  textAlign: "center"
                }}>
                  <h4 style={{ color: "var(--accent-gold)", fontSize: "24px", fontWeight: "800", margin: "0 0 4px 0" }}>100%</h4>
                  <p style={{ fontSize: "12px", color: "rgba(250, 247, 240, 0.8)", margin: 0, fontWeight: "600" }}>Pure Gadwal Weave</p>
                  <span style={{ fontSize: "10px", color: "rgba(250, 247, 240, 0.5)" }}>Tested Silk Warp</span>
                </div>

                <div style={{
                  backgroundColor: "rgba(30, 8, 14, 0.75)",
                  border: "1px solid rgba(212, 175, 55, 0.25)",
                  borderRadius: "12px",
                  padding: "16px 14px",
                  textAlign: "center"
                }}>
                  <h4 style={{ color: "var(--accent-gold)", fontSize: "24px", fontWeight: "800", margin: "0 0 4px 0" }}>40+ Yrs</h4>
                  <p style={{ fontSize: "12px", color: "rgba(250, 247, 240, 0.8)", margin: 0, fontWeight: "600" }}>Artisan Legacy</p>
                  <span style={{ fontSize: "10px", color: "rgba(250, 247, 240, 0.5)" }}>Master Weavers</span>
                </div>

                <div style={{
                  backgroundColor: "rgba(30, 8, 14, 0.75)",
                  border: "1px solid rgba(212, 175, 55, 0.25)",
                  borderRadius: "12px",
                  padding: "16px 14px",
                  textAlign: "center"
                }}>
                  <h4 style={{ color: "var(--accent-gold)", fontSize: "24px", fontWeight: "800", margin: "0 0 4px 0" }}>Direct</h4>
                  <p style={{ fontSize: "12px", color: "rgba(250, 247, 240, 0.8)", margin: 0, fontWeight: "600" }}>Loom Pricing</p>
                  <span style={{ fontSize: "10px", color: "rgba(250, 247, 240, 0.5)" }}>Zero Markup</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "14px", marginTop: "12px", flexWrap: "wrap" }}>
                <a
                  href="#/shop"
                  onClick={() => setCurrentTab("shop")}
                  className="btn btn-gold"
                  style={{ padding: "14px 28px", fontSize: "14px", display: "inline-flex", gap: "8px", alignItems: "center" }}
                >
                  <ShoppingBag size={16} /> Explore Heritage Collection
                </a>
                <a
                  href="#/b2b"
                  onClick={() => setCurrentTab("b2b")}
                  className="btn btn-outline"
                  style={{ padding: "14px 28px", fontSize: "14px", display: "inline-flex", gap: "8px", alignItems: "center" }}
                >
                  Wholesale Enquiry
                </a>
              </div>
            </div>

            {/* Right Column: Grand Saree Showcase Display Card (Enlarged Height: 500px) */}
            <div style={{
              position: "relative",
              height: "500px",
              overflow: "hidden",
              borderRadius: "24px",
              border: "2px solid var(--accent-gold)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(212, 175, 55, 0.35)",
              backgroundColor: "rgba(74, 14, 21, 0.4)"
            }}>
              {/* Sliding saree image container */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  type: "spring",
                  stiffness: 45,
                  damping: 16,
                  duration: 1.6
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

                {/* Subtle top badge */}
                <div style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  backgroundColor: "rgba(18, 4, 7, 0.85)",
                  border: "1px solid var(--accent-gold)",
                  borderRadius: "var(--radius-full)",
                  padding: "6px 14px",
                  fontSize: "11px",
                  color: "var(--accent-gold)",
                  fontWeight: "800",
                  letterSpacing: "1px",
                  backdropFilter: "blur(8px)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <Sparkles size={12} /> AUTHENTIC PITLOOM DRAPE
                </div>

                {/* Floating specifications label */}
                <div style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "24px",
                  right: "24px",
                  backgroundColor: "rgba(24, 6, 11, 0.9)",
                  border: "1.5px solid var(--accent-gold)",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  color: "#ffffff",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <span style={{ fontSize: "11px", color: "var(--accent-gold)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Heritage Gadwal Collection
                      </span>
                      <h4 style={{ fontSize: "17px", fontWeight: "700", margin: "2px 0 4px 0" }}>
                        Heritage Mustard Gold & Contrast Dark Pink Saree
                      </h4>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", margin: 0 }}>
                        Pure gold zari shuttle weaves • Traditional temple knot join • Breathable luxury silk-cotton body
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div>
                        <div style={{ fontSize: "11px", color: "var(--accent-gold)", fontWeight: "700" }}>DIRECT LOOM RATE</div>
                        <div style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff" }}>
                          ₹3,899 <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", textDecoration: "line-through" }}>₹5,899</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const prod = products.find(p => p.name.includes("Mustard") || p.id === 3);
                          if (prod) addToCart(prod, 1);
                        }}
                        className="btn btn-gold"
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 20px", fontSize: "12px", minHeight: "auto", whiteSpace: "nowrap" }}
                      >
                        <Plus size={16} strokeWidth={2.5} />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
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
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", fontSize: "13px", minHeight: "auto" }}
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    <span>Add Saree</span>
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
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="btn btn-primary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      fontSize: "13px",
                      fontWeight: "700",
                      minHeight: "auto",
                      borderRadius: "var(--radius-sm)"
                    }}
                    title="Add to Cart"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    <span>Add</span>
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

      {/* 5. LIVE VIDEO STUDIO & INSTAGRAM REELS SHOWCASE */}
      <section className="container" style={{ marginBottom: "48px", marginTop: "10px" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          style={{ textAlign: "center", marginBottom: "24px" }}
        >
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 14px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "rgba(212,175,55,0.1)",
            border: "1px solid var(--border-gold)",
            marginBottom: "8px",
            fontSize: "12px",
            fontWeight: "700",
            color: "var(--primary-maroon)"
          }} className="dark-gold-text">
            <Film size={13} style={{ color: "var(--accent-gold)" }} /> LIVE FROM OUR YELAHANKA LOOMS
          </div>
          <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>
            Behind the Pitloom: Videos & Draping Reels
          </h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "580px", margin: "0 auto", fontSize: "14px" }}>
            Authentic pitloom weaving, pure zari border interlocking, and wholesale collection walkthroughs.
          </p>

          {/* Interactive Filter Pills */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "16px",
            flexWrap: "wrap"
          }}>
            {[
              { id: "all", label: `🔥 All Stories (${officialMediaList.length})` },
              { id: "youtube", label: `🧵 Pitloom Masterclass (${officialMediaList.filter(m => m.type === "youtube").length})` },
              { id: "instagram", label: `✨ Instagram Reels (${officialMediaList.filter(m => m.type === "instagram").length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMediaFilter(tab.id)}
                style={{
                  padding: "7px 18px",
                  borderRadius: "var(--radius-full)",
                  border: activeMediaFilter === tab.id ? "1.5px solid var(--accent-gold)" : "1px solid rgba(212, 175, 55, 0.2)",
                  backgroundColor: activeMediaFilter === tab.id ? "rgba(212, 175, 55, 0.22)" : "rgba(30, 8, 14, 0.6)",
                  color: activeMediaFilter === tab.id ? "var(--accent-gold)" : "#ffffff",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.25s ease"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 1. CINEMATIC SPOTLIGHT THEATER PLAYER (COMPACT WITH AURA ANIMATION) */}
        <div style={{ position: "relative", maxWidth: "780px", margin: "0 auto 32px auto" }}>
          {/* Animated Glowing Aura Behind Video Player */}
          <div className="aura-backdrop" />

          <div 
            className="glass-card"
            style={{
              position: "relative",
              borderRadius: "18px",
              border: "1.5px solid rgba(212, 175, 55, 0.4)",
              padding: "16px 18px",
              backgroundColor: "rgba(20, 4, 8, 0.88)",
              boxShadow: "0 15px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.25)",
              backdropFilter: "blur(20px)",
              zIndex: 1
            }}
          >
            {/* Theater Header Bar */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              flexWrap: "wrap",
              gap: "8px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {currentMedia.type === "youtube" ? (
                  <div style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: "#dc2626",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff"
                  }}>
                    <YoutubeIcon />
                  </div>
                ) : (
                  <div style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff"
                  }}>
                    <InstagramIcon />
                  </div>
                )}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      backgroundColor: isPlayingVideo ? "#10b981" : "var(--accent-gold)",
                      boxShadow: isPlayingVideo ? "0 0 8px #10b981" : "0 0 8px var(--accent-gold)",
                      display: "inline-block"
                    }} />
                    <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1px", color: "var(--accent-gold)", textTransform: "uppercase" }}>
                      {isPlayingVideo ? "NOW PLAYING" : "CLICK TO PLAY"} · {currentMedia.channel}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "15px", color: "#ffffff", fontWeight: "700", marginTop: "1px" }}>
                    {currentMedia.title}
                  </h3>
                </div>
              </div>

              <a 
                href={currentMedia.channelUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-gold"
                style={{ padding: "6px 14px", fontSize: "11px", minHeight: "auto", display: "inline-flex", gap: "5px" }}
              >
                <span>Visit {currentMedia.type === "youtube" ? "YouTube" : "Instagram"}</span>
                <ExternalLink size={11} />
              </a>
            </div>

            {/* 16:9 Widescreen Cinema Container with Click-To-Play & Aura Rings */}
            <div 
              style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                overflow: "hidden",
                borderRadius: "12px",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                backgroundColor: "#000000",
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.8)",
                cursor: isPlayingVideo ? "default" : "pointer"
              }}
              onClick={() => {
                if (!isPlayingVideo) setIsPlayingVideo(true);
              }}
            >
              {isPlayingVideo ? (
                <iframe
                  key={currentMedia.id}
                  src={`https://www.youtube.com/embed/${currentMedia.id}?autoplay=1&rel=0&modestbranding=1`}
                  title={currentMedia.title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none"
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  {/* High-definition Cover Image */}
                  <img
                    src={currentMedia.thumb}
                    alt={currentMedia.title}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />

                  {/* Dark Vignette Overlay */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(20,5,8,0.4) 50%, rgba(10,2,4,0.85) 100%)"
                  }} />

                  {/* Center Aura Glowing Play Button */}
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    zIndex: 3
                  }}>
                    <div style={{ position: "relative" }}>
                      {/* Concentric Aura Ripples */}
                      <div className="aura-play-ring" />
                      <div className="aura-play-ring-delayed" />

                      {/* Play Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPlayingVideo(true);
                        }}
                        aria-label="Play Video"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          backgroundColor: "var(--accent-gold)",
                          border: "2px solid #ffffff",
                          color: "#1a0508",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 0 30px rgba(212, 175, 55, 0.9), 0 0 50px rgba(225, 48, 108, 0.5)",
                          cursor: "pointer",
                          transition: "transform 0.25s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
                      >
                        <Play size={24} fill="#1a0508" style={{ marginLeft: "3px" }} />
                      </button>
                    </div>

                    <span style={{
                      backgroundColor: "rgba(18, 4, 7, 0.85)",
                      color: "#ffffff",
                      border: "1px solid rgba(212, 175, 55, 0.4)",
                      padding: "4px 12px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "11px",
                      fontWeight: "700",
                      letterSpacing: "0.5px",
                      backdropFilter: "blur(6px)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.5)"
                    }}>
                      Click to Play Video
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Theater Bottom Info & Action Bar */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "12px",
              paddingTop: "10px",
              borderTop: "1px solid rgba(212, 175, 55, 0.2)",
              flexWrap: "wrap",
              gap: "10px"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--accent-gold)", textTransform: "uppercase" }}>
                    {currentMedia.badge}
                  </span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>•</span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>{currentMedia.views}</span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>•</span>
                  <span style={{ fontSize: "10px", color: "#10b981", fontWeight: "600" }}>Authentic Handloom</span>
                </div>
                <p style={{ fontSize: "12px", color: "rgba(250, 247, 240, 0.8)", margin: 0, maxWidth: "520px" }}>
                  {currentMedia.desc}
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <a 
                  href={`https://wa.me/918073428079?text=Hi%20Sri%20Someshwara%20Silk%20Sarees,%20I%20am%20watching%20the%20video%20"${encodeURIComponent(currentMedia.title)}"%20and%20want%20to%20order%20similar%20sarees`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ padding: "7px 14px", fontSize: "11px", minHeight: "auto", display: "inline-flex", gap: "5px" }}
                >
                  <PhoneCall size={12} /> Enquire Saree
                </a>
                <a 
                  href={currentMedia.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ padding: "7px 14px", fontSize: "11px", minHeight: "auto", display: "inline-flex", gap: "5px" }}
                >
                  <span>Open Link</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. COMPACT MULTI-CARD HORIZONTAL SLIDING CAROUSEL */}
        <div style={{ maxWidth: "1200px", margin: "0 auto 30px auto", padding: "0 10px" }}>
          {/* Carousel Header with Navigation Controls */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "12px",
            flexWrap: "wrap",
            gap: "10px"
          }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--accent-gold)", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                Loom Stories Showcase
              </span>
              <h3 style={{ fontSize: "18px", color: "#ffffff", fontWeight: "700", marginTop: "1px" }}>
                Browse Videos & Reels Carousel
              </h3>
            </div>

            {/* Slider Navigation Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "var(--accent-gold)",
                letterSpacing: "0.5px",
                backgroundColor: "rgba(212, 175, 55, 0.12)",
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(212, 175, 55, 0.25)"
              }}>
                0{activeMediaIndex + 1} / 0{officialMediaList.length}
              </span>
              <button
                onClick={() => scrollVideoCarousel("prev")}
                aria-label="Previous story"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1px solid rgba(212, 175, 55, 0.35)",
                  backgroundColor: "rgba(30, 8, 14, 0.75)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--accent-gold)";
                  e.currentTarget.style.color = "#1a0508";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(30, 8, 14, 0.75)";
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollVideoCarousel("next")}
                aria-label="Next story"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1px solid rgba(212, 175, 55, 0.35)",
                  backgroundColor: "rgba(30, 8, 14, 0.75)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--accent-gold)";
                  e.currentTarget.style.color = "#1a0508";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(30, 8, 14, 0.75)";
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Carousel Track Container */}
          <div 
            ref={videoCarouselRef}
            className="media-carousel-track"
          >
            {filteredMediaList.map((media, idx) => {
              const originalIndex = officialMediaList.findIndex(m => m.id === media.id);
              const isActive = originalIndex === activeMediaIndex;

              return (
                <div
                  key={media.id}
                  onClick={() => {
                    setActiveMediaIndex(originalIndex);
                    setIsPlayingVideo(true);
                  }}
                  className={`media-carousel-card ${isActive ? "active-media" : ""}`}
                >
                  {/* Full-bleed Video Cover Image */}
                  <img
                    src={media.thumb}
                    alt={media.title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease"
                    }}
                    loading="lazy"
                  />

                  {/* Dark Vignette Gradient Overlay */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(20,5,8,0.5) 45%, rgba(14,3,5,0.96) 100%)"
                  }} />

                  {/* Top Bar of Card */}
                  <div style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    right: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 2
                  }}>
                    {media.type === "youtube" ? (
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        backgroundColor: "rgba(220, 38, 38, 0.9)",
                        color: "#ffffff",
                        padding: "3px 6px",
                        borderRadius: "5px",
                        fontSize: "9px",
                        fontWeight: "800",
                        letterSpacing: "0.5px"
                      }}>
                        <YoutubeIcon /> VIDEO
                      </span>
                    ) : (
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
                        color: "#ffffff",
                        padding: "3px 6px",
                        borderRadius: "5px",
                        fontSize: "9px",
                        fontWeight: "800",
                        letterSpacing: "0.5px"
                      }}>
                        <InstagramIcon /> REEL
                      </span>
                    )}

                    <span style={{
                      backgroundColor: "rgba(0,0,0,0.65)",
                      color: "rgba(255,255,255,0.9)",
                      padding: "3px 6px",
                      borderRadius: "5px",
                      fontSize: "9px",
                      fontWeight: "700",
                      backdropFilter: "blur(6px)"
                    }}>
                      {media.views}
                    </span>
                  </div>

                  {/* Center Play Button Overlay */}
                  <div style={{
                    position: "absolute",
                    top: "42%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <div style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      backgroundColor: isActive ? "var(--accent-gold)" : "rgba(30, 8, 14, 0.75)",
                      border: "2px solid var(--accent-gold)",
                      color: isActive ? "#1a0508" : "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isActive ? "0 0 20px rgba(212, 175, 55, 0.8)" : "0 6px 16px rgba(0,0,0,0.5)",
                      transition: "all 0.25s ease"
                    }}>
                      <Play size={16} fill="currentColor" style={{ marginLeft: "2px" }} />
                    </div>

                    {isActive && (
                      <span style={{
                        fontSize: "9px",
                        fontWeight: "800",
                        color: "#1a0508",
                        backgroundColor: "var(--accent-gold)",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        boxShadow: "0 0 12px rgba(212, 175, 55, 0.6)"
                      }}>
                        {isPlayingVideo ? "PLAYING" : "SELECTED"}
                      </span>
                    )}
                  </div>

                  {/* Bottom Text Content */}
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "12px",
                    zIndex: 2
                  }}>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      color: "var(--accent-gold)",
                      letterSpacing: "0.5px",
                      display: "block",
                      marginBottom: "2px"
                    }}>
                      {media.tag}
                    </span>
                    <h4 style={{
                      fontSize: "13px",
                      color: "#ffffff",
                      fontWeight: "700",
                      lineHeight: "1.3",
                      marginBottom: "4px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {media.title}
                    </h4>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid rgba(212, 175, 55, 0.2)",
                      paddingTop: "6px",
                      marginTop: "4px"
                    }}>
                      <span style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: "700" }}>
                        {isActive && isPlayingVideo ? "Streaming Now" : "Click to Play ▶"}
                      </span>
                      <a
                        href={media.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: "10px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          textDecoration: "underline"
                        }}
                      >
                        Live Link <ExternalLink size={9} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social Follow CTA Buttons with Verified Live Links */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap"
        }}>
          <a
            href="https://www.instagram.com/sssilksarees49/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ padding: "12px 28px", gap: "8px", display: "inline-flex", alignItems: "center" }}
          >
            <InstagramIcon /> Follow on Instagram (@sssilksarees49)
          </a>
          <a
            href="https://www.youtube.com/@SSSilksarees"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ padding: "12px 28px", gap: "8px", display: "inline-flex", alignItems: "center" }}
          >
            <YoutubeIcon /> Subscribe on YouTube (@SSSilksarees)
          </a>
          <a
            href="https://wa.me/918073428079?text=Hi%20Sri%20Someshwara%20Silk%20Sarees,%20I%20would%20like%20to%20see%20live%20video%20call%20saree%20collection"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
            style={{ padding: "12px 28px", gap: "8px", display: "inline-flex", alignItems: "center" }}
          >
            <PhoneCall size={16} /> Live Video Call Saree Drape
          </a>
        </div>
      </section>

      {/* 6. LIVE B2B WHOLESALE PRICING CALCULATOR */}
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
