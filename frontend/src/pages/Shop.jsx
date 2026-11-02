import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ShoppingBag, X, HelpCircle, ArrowUpDown, Search, Plus } from "lucide-react";
import WhatsAppButton from "../components/WhatsAppButton";

export default function Shop({ addToCart, searchQuery, setSearchQuery, products }) {
  // Filter States
  const [selectedWeaves, setSelectedWeaves] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [priceRange, setPriceRange] = useState(15000); // Max bound ₹15,000
  const [sortBy, setSortBy] = useState("popular");
  
  // Selected Saree Detail Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Mobile filter drawer state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Extract unique filter categories from products database
  const weaves = [...new Set(products.map((p) => p.weave))];
  const fabrics = [...new Set(products.map((p) => p.fabric))];
  const colors = [...new Set(products.map((p) => p.color))];
  const occasions = [...new Set(products.map((p) => p.occasion))];

  // Hex color lookup for swatches
  const colorMap = {
    "Maroon": "#800000",
    "Emerald Green": "#0f766e",
    "Mustard Gold": "#d97706",
    "Peacock Blue": "#0369a1",
    "Violet": "#6d28d9",
    "Orange": "#ea580c",
    "Black": "#111827",
    "Pink": "#db2777"
  };

  // Catalog item counts
  const getWeaveCount = (w) => products.filter((p) => p.weave === w).length;
  const getFabricCount = (f) => products.filter((p) => p.fabric === f).length;
  const getColorCount = (c) => products.filter((p) => p.color === c).length;
  const getOccasionCount = (o) => products.filter((p) => p.occasion === o).length;

  // Active filter chip styling
  const chipStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "var(--bg-cream)",
    border: "1px solid var(--border-gold)",
    borderRadius: "var(--radius-full)",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "700",
    color: "var(--text-dark)",
    cursor: "pointer",
    boxShadow: "var(--shadow-sm)",
    transition: "all var(--transition-fast)"
  };

  // Helper toggle functions
  const toggleFilter = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedWeaves([]);
    setSelectedFabrics([]);
    setSelectedColors([]);
    setSelectedOccasions([]);
    setPriceRange(15000);
    setSearchQuery("");
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.weave.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesWeave = selectedWeaves.length === 0 || selectedWeaves.includes(product.weave);
    const matchesFabric = selectedFabrics.length === 0 || selectedFabrics.includes(product.fabric);
    const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.color);
    const matchesOccasion = selectedOccasions.length === 0 || selectedOccasions.includes(product.occasion);
    const matchesPrice = product.price <= priceRange;

    return matchesSearch && matchesWeave && matchesFabric && matchesColor && matchesOccasion && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0; // Popular / Default
  });

  return (
    <div className="container" style={{ paddingTop: "40px" }}>
      {/* Title & Page Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "32px",
        borderBottom: "1px solid var(--border-light)",
        paddingBottom: "16px"
      }}>
        <div>
          <h1 style={{ fontSize: "36px", marginBottom: "4px" }}>Saree Catalog</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Showing {filteredProducts.length} exquisite piece{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>
        
        {/* Sort & Search & Mobile filter button */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Shop Page Localized Search Bar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--bg-white)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-sm)",
            padding: "8px 12px",
            minWidth: "220px"
          }} className="search-bar-shop">
            <Search size={16} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search sarees, SKUs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                background: "none",
                fontSize: "14px",
                color: "var(--text-dark)",
                outline: "none",
                width: "100%"
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "0"
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          {/* Sorting */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--bg-white)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-sm)",
            padding: "8px 12px"
          }}>
            <ArrowUpDown size={16} style={{ color: "var(--primary-maroon)" }} />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                border: "none",
                background: "none",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-dark)",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="popular">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button 
            onClick={() => setFilterDrawerOpen(true)}
            className="btn btn-outline mobile-filter-btn"
            style={{
              padding: "10px 16px",
              fontSize: "14px",
              display: "none"
            }}
          >
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Product Grid */}
      <div style={{ display: "flex", gap: "40px" }} className="shop-main-layout">
        
        {/* Sidebar Filters - Desktop */}
        <aside className="desktop-filters" style={{
          width: "280px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "28px"
        }}>
          {/* Filter Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h3 style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={18} /> Filters
            </h3>
            <button 
              onClick={handleResetFilters}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary-maroon)",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer"
              }}
              className="dark-gold-text"
            >
              Reset All
            </button>
          </div>

          {/* Price Range Slider (₹1,000 to ₹15,000) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ fontSize: "15px", color: "var(--text-dark)" }}>Max Price: ₹{priceRange.toLocaleString("en-IN")}</h4>
            <input 
              type="range" 
              min="1000" 
              max="15000" 
              step="500"
              value={priceRange} 
              onChange={(e) => setPriceRange(Number(e.target.value))}
              style={{
                accentColor: "var(--primary-maroon)",
                width: "100%",
                cursor: "pointer"
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)" }}>
              <span>₹1,000</span>
              <span>₹15,000</span>
            </div>
          </div>

          {/* Weave Type Filter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ fontSize: "15px", color: "var(--text-dark)", borderBottom: "1px solid var(--border-light)", paddingBottom: "6px" }}>Weave Type</h4>
            {weaves.map((weave) => (
              <label key={weave} style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer" }} className="filter-label">
                <input 
                  type="checkbox" 
                  checked={selectedWeaves.includes(weave)}
                  onChange={() => toggleFilter(weave, selectedWeaves, setSelectedWeaves)}
                  style={{ accentColor: "var(--primary-maroon)" }}
                />
                <span style={{ flexGrow: 1 }}>{weave}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>({getWeaveCount(weave)})</span>
              </label>
            ))}
          </div>

          {/* Fabric Filter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ fontSize: "15px", color: "var(--text-dark)", borderBottom: "1px solid var(--border-light)", paddingBottom: "6px" }}>Fabric</h4>
            {fabrics.map((fabric) => (
              <label key={fabric} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer" }} className="filter-label">
                <input 
                  type="checkbox" 
                  checked={selectedFabrics.includes(fabric)}
                  onChange={() => toggleFilter(fabric, selectedFabrics, setSelectedFabrics)}
                  style={{ accentColor: "var(--primary-maroon)" }}
                />
                <span style={{ flexGrow: 1 }}>{fabric}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>({getFabricCount(fabric)})</span>
              </label>
            ))}
          </div>

          {/* Color Filter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ fontSize: "15px", color: "var(--text-dark)", borderBottom: "1px solid var(--border-light)", paddingBottom: "6px" }}>Primary Color</h4>
            {colors.map((color) => (
              <label key={color} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer" }} className="filter-label">
                <input 
                  type="checkbox" 
                  checked={selectedColors.includes(color)}
                  onChange={() => toggleFilter(color, selectedColors, setSelectedColors)}
                  style={{ accentColor: "var(--primary-maroon)" }}
                />
                {/* Visual Swatch Sphere */}
                <span style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: colorMap[color] || "#ccc",
                  border: "1px solid rgba(0,0,0,0.15)",
                  flexShrink: 0
                }} />
                <span style={{ flexGrow: 1 }}>{color}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>({getColorCount(color)})</span>
              </label>
            ))}
          </div>

          {/* Occasion Filter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ fontSize: "15px", color: "var(--text-dark)", borderBottom: "1px solid var(--border-light)", paddingBottom: "6px" }}>Occasion</h4>
            {occasions.map((occ) => (
              <label key={occ} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer" }} className="filter-label">
                <input 
                  type="checkbox" 
                  checked={selectedOccasions.includes(occ)}
                  onChange={() => toggleFilter(occ, selectedOccasions, setSelectedOccasions)}
                  style={{ accentColor: "var(--primary-maroon)" }}
                />
                <span style={{ flexGrow: 1 }}>{occ}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>({getOccasionCount(occ)})</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Product Cards Grid */}
        <section style={{ flexGrow: 1 }}>
          {/* Active Filter Chips */}
          {(selectedWeaves.length > 0 || selectedFabrics.length > 0 || selectedColors.length > 0 || selectedOccasions.length > 0 || searchQuery !== "") && (
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
              marginBottom: "24px",
              backgroundColor: "rgba(74, 14, 21, 0.03)",
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-light)"
            }} className="active-chips-container">
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", marginRight: "4px" }}>Active Filters:</span>
              
              {searchQuery && (
                <div style={chipStyle} onClick={() => setSearchQuery("")}>
                  Search: "{searchQuery}" <X size={12} />
                </div>
              )}
              {selectedWeaves.map(weave => (
                <div key={weave} style={chipStyle} onClick={() => toggleFilter(weave, selectedWeaves, setSelectedWeaves)}>
                  {weave} <X size={12} />
                </div>
              ))}
              {selectedFabrics.map(fabric => (
                <div key={fabric} style={chipStyle} onClick={() => toggleFilter(fabric, selectedFabrics, setSelectedFabrics)}>
                  {fabric} <X size={12} />
                </div>
              ))}
              {selectedColors.map(color => (
                <div key={color} style={chipStyle} onClick={() => toggleFilter(color, selectedColors, setSelectedColors)}>
                  {color} <X size={12} />
                </div>
              ))}
              {selectedOccasions.map(occ => (
                <div key={occ} style={chipStyle} onClick={() => toggleFilter(occ, selectedOccasions, setSelectedOccasions)}>
                  {occ} <X size={12} />
                </div>
              ))}
              
              <button 
                onClick={handleResetFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary-maroon)",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  marginLeft: "auto",
                  padding: "4px 8px"
                }}
                className="dark-gold-text"
              >
                Clear All
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              color: "var(--text-muted)",
              gap: "16px"
            }}>
              <HelpCircle size={48} style={{ color: "var(--accent-gold)" }} />
              <h3>No Products Found</h3>
              <p>Try refining your search keyword or relaxing filter options.</p>
              <button onClick={handleResetFilters} className="btn btn-outline" style={{ marginTop: "8px" }}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <motion.div 
                  layout
                  key={product.id}
                  whileHover={{ y: -6 }}
                  className="glass-card-gold"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    cursor: "pointer"
                  }}
                  onClick={() => setSelectedProduct(product)}
                >
                  {/* Image wrapper */}
                  <div style={{ position: "relative", overflow: "hidden", height: "300px" }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }} 
                      loading="lazy"
                    />
                    
                    {/* Badges for stock */}
                    <div style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px"
                    }}>
                      <span className="badge badge-maroon" style={{ backgroundColor: "var(--primary-maroon)", color: "#ffffff" }}>
                        {product.weave}
                      </span>
                      {product.stock === 0 ? (
                        <span className="badge" style={{ backgroundColor: "#ef4444", color: "#ffffff" }}>Sold Out</span>
                      ) : product.stock === 1 ? (
                        <span className="badge" style={{ backgroundColor: "#f59e0b", color: "#ffffff" }}>Only 1 Left</span>
                      ) : null}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }} onClick={(e) => {
                    // Prevent card click modal if clicking button directly
                  }}>
                    <h3 style={{ fontSize: "16px", fontFamily: "inherit", fontWeight: "700" }}>
                      {product.name}
                    </h3>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span>Fabric: {product.fabric}</span>
                      <span>•</span>
                      <span>Color: {product.color}</span>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "auto",
                      borderTop: "1px solid var(--border-light)",
                      paddingTop: "12px"
                    }}>
                      <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--primary-maroon)" }} className="price-tag">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (product.stock > 0) addToCart(product, 1);
                        }}
                        disabled={product.stock === 0}
                        className="btn btn-primary"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "7px 14px",
                          fontSize: "12px",
                          fontWeight: "700",
                          borderRadius: "var(--radius-sm)",
                          minHeight: "auto"
                        }}
                        title="Add to Cart"
                      >
                        <Plus size={15} strokeWidth={2.5} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Saree Detail Dialog / Modal (Phase 2) */}
      <AnimatePresence>
        {selectedProduct && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 300,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px"
          }} onClick={() => setSelectedProduct(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                backgroundColor: "var(--bg-white)",
                color: "var(--text-dark)",
                maxWidth: "800px",
                width: "100%",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                border: "2px solid var(--accent-gold)",
                maxHeight: "90vh",
                overflowY: "auto",
                position: "relative"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  zIndex: 10,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"
              }}>
                {/* Product Image */}
                <div style={{ height: "450px" }}>
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }} 
                  />
                </div>

                {/* Product Specifications & Order Details */}
                <div style={{
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}>
                  <div>
                    <span className="badge badge-gold" style={{ marginBottom: "8px" }}>
                      {selectedProduct.weave}
                    </span>
                    <h2 style={{ fontSize: "24px", color: "var(--primary-maroon)" }} className="dark-gold-text">
                      {selectedProduct.name}
                    </h2>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>SKU: {selectedProduct.sku}</span>
                  </div>

                  <span style={{ fontSize: "28px", fontWeight: "800", color: "var(--primary-maroon)" }} className="price-tag">
                    ₹{selectedProduct.price.toLocaleString("en-IN")}
                  </span>

                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                    {selectedProduct.description}
                  </p>

                  {/* Saree Specific Specifications */}
                  <div style={{
                    backgroundColor: "rgba(74,14,21,0.03)",
                    padding: "16px",
                    borderRadius: "var(--radius-sm)",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    fontSize: "13px"
                  }} className="specs-box">
                    <div>
                      <strong>Fabric:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedProduct.fabric}</span>
                    </div>
                    <div>
                      <strong>Occasion:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedProduct.occasion}</span>
                    </div>
                    <div>
                      <strong>Length:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedProduct.length}</span>
                    </div>
                    <div>
                      <strong>Weight:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedProduct.weight}</span>
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <strong>Care:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedProduct.care}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "8px"
                  }}>
                    <button
                      onClick={() => {
                        if (selectedProduct.stock > 0) addToCart(selectedProduct, 1);
                        setSelectedProduct(null);
                      }}
                      disabled={selectedProduct.stock === 0}
                      className="btn btn-primary"
                      style={{
                        padding: "14px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        fontWeight: "700"
                      }}
                    >
                      <Plus size={18} strokeWidth={2.5} />
                      <span>Add Saree to Bag</span>
                    </button>
                    
                    {/* Per-product WhatsApp Inquiry */}
                    <WhatsAppButton product={selectedProduct} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Filter Drawer (Drawer modal) */}
      {filterDrawerOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 400,
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "flex-start"
        }} onClick={() => setFilterDrawerOpen(false)}>
          <div style={{
            backgroundColor: "var(--bg-white)",
            width: "80%",
            maxWidth: "320px",
            height: "100vh",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            overflowY: "auto"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>Filters</h3>
              <button onClick={() => setFilterDrawerOpen(false)} style={{ background: "none", border: "none" }}><X size={24} /></button>
            </div>
            
            {/* Re-use sidebar checks here */}
            {/* Price slider */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4>Max Price: ₹{priceRange}</h4>
              <input 
                type="range" 
                min="1000" 
                max="15000" 
                step="500"
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary-maroon)" }}
              />
            </div>

            {/* Weaves */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4>Weave Type</h4>
              {weaves.map((weave) => (
                <label key={weave} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input 
                    type="checkbox" 
                    checked={selectedWeaves.includes(weave)}
                    onChange={() => toggleFilter(weave, selectedWeaves, setSelectedWeaves)}
                  />
                  {weave}
                </label>
              ))}
            </div>

            {/* Fabrics */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4>Fabric</h4>
              {fabrics.map((fabric) => (
                <label key={fabric} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input 
                    type="checkbox" 
                    checked={selectedFabrics.includes(fabric)}
                    onChange={() => toggleFilter(fabric, selectedFabrics, setSelectedFabrics)}
                  />
                  {fabric}
                </label>
              ))}
            </div>

            <button 
              onClick={() => {
                handleResetFilters();
                setFilterDrawerOpen(false);
              }} 
              className="btn btn-outline"
            >
              Reset All
            </button>
            
            <button 
              onClick={() => setFilterDrawerOpen(false)} 
              className="btn btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <style>{`
        .dark .price-tag {
          color: var(--accent-gold) !important;
        }
        .dark .dark-gold-text {
          color: var(--accent-gold) !important;
        }
        @media (max-width: 1024px) {
          .desktop-filters {
            display: none !important;
          }
          .mobile-filter-btn {
            display: flex !important;
          }
          .shop-main-layout {
            gap: 0px !important;
          }
        }
        @media (max-width: 640px) {
          .specs-box {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
