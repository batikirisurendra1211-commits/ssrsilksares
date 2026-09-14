import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!visible) return null;

  return (
    <button 
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        backgroundColor: "var(--primary-maroon)",
        color: "var(--bg-cream)",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "var(--shadow-md)",
        zIndex: 90,
        border: "1px solid var(--accent-gold)",
        cursor: "pointer",
        transition: "all var(--transition-normal)"
      }}
      className="scroll-top-btn"
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
      
      <style>{`
        .scroll-top-btn:hover {
          background-color: var(--accent-gold) !important;
          color: var(--primary-maroon) !important;
          transform: translateY(-4px);
        }
      `}</style>
    </button>
  );
}
