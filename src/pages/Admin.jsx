import React, { useEffect, useState } from "react";
import { Package, ClipboardList, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, ShoppingBag, Edit, Plus, Trash, X, Search, History } from "lucide-react";
import ImageDropzone from "../components/ImageDropzone";

export default function Admin({ currentUser, orders, setOrders, products, setProducts, fetchProducts, fetchOrders }) {
  // Order search states
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // Product editor modals/states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form States
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formPrice, setFormPrice] = useState(2999);
  const [formStock, setFormStock] = useState(5);
  const [formWeave, setFormWeave] = useState("Gadwal Semi Silk");
  const [formFabric, setFormFabric] = useState("Semi Silk");
  const [formColor, setFormColor] = useState("Maroon");
  const [formOccasion, setFormOccasion] = useState("Festive Wear");
  const [formDesc, setFormDesc] = useState("");
  const [formCare, setFormCare] = useState("Dry Clean Recommended.");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [creationHistory, setCreationHistory] = useState([]);
  const API_URL = "http://localhost:8000/api";

  const fetchCreationHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/product-history`);
      if (response.ok) setCreationHistory(await response.json());
    } catch (error) {
      console.warn("Failed to load product history:", error);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") fetchCreationHistory();
  }, [currentUser?.role]);

  // Security guard check
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="container" style={{ paddingTop: "80px", textAlign: "center" }}>
        <div className="glass-card" style={{ padding: "48px", maxWidth: "500px", margin: "0 auto" }}>
          <AlertTriangle size={48} style={{ color: "#eab308", marginBottom: "16px" }} />
          <h2>Access Prohibited</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "8px" }}>
            The admin operations dashboard is strictly reserved for authorized administrators. Please log in with admin privileges.
          </p>
        </div>
      </div>
    );
  }

  // Calculate high level stats
  const totalSales = orders
    .filter(o => o.status !== "Cancelled" && o.status !== "Pending Inquiry")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === "Processing" || o.status === "Pending Inquiry").length;
  const lowStockItems = products.filter(p => p.stock <= 2).length;

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        if (fetchOrders) await fetchOrders();
      } else {
        alert("Failed to update status on server.");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Create Product handler
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!formImageUrl) {
      alert("Please upload a saree photograph before adding this product.");
      return;
    }
    const productData = {
      sku: formSku || "SS-GW-SLK-" + Math.floor(Math.random() * 1000),
      name: formName,
      price: Number(formPrice),
      stock: Number(formStock),
      weave: formWeave,
      fabric: formFabric,
      color: formColor,
      occasion: formOccasion,
      description: formDesc || "Premium handloom Gadwal saree.",
      care: formCare || "Dry Clean Only.",
      length: "6.3 Meters (5.5m Saree + 0.8m Blouse)",
      weight: "550 grams",
      image: formImageUrl,
      category: "Sarees",
      discount: 0
    };

    try {
      const res = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        if (fetchProducts) await fetchProducts();
        await fetchCreationHistory();
        setShowAddModal(false);
        resetForm();
      } else {
        alert("Failed to create product on backend.");
      }
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  // Edit Product handler
  const handleEditProduct = async (e) => {
    e.preventDefault();
    const productData = {
      sku: formSku,
      name: formName,
      price: Number(formPrice),
      stock: Number(formStock),
      weave: formWeave,
      fabric: formFabric,
      color: formColor,
      occasion: formOccasion,
      description: formDesc,
      care: formCare,
      image: formImageUrl
    };

    try {
      const res = await fetch(`http://localhost:8000/api/products/${selectedProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        if (fetchProducts) await fetchProducts();
        await fetchCreationHistory();
        setShowEditModal(false);
        resetForm();
      } else {
        alert("Failed to update product details.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // Delete Saree handler
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to discontinue (delete) this saree from the catalog?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/products/${productId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          if (fetchProducts) await fetchProducts();
          await fetchCreationHistory();
        } else {
          alert("Failed to delete product from database.");
        }
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormName(product.name);
    setFormSku(product.sku);
    setFormPrice(product.price);
    setFormStock(product.stock);
    setFormWeave(product.weave);
    setFormFabric(product.fabric);
    setFormColor(product.color);
    setFormOccasion(product.occasion);
    setFormDesc(product.description);
    setFormCare(product.care);
    
    setFormImageUrl(product.image || "");
    setShowEditModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormName("");
    setFormSku("");
    setFormPrice(2999);
    setFormStock(5);
    setFormWeave("Gadwal Semi Silk");
    setFormFabric("Semi Silk");
    setFormColor("Maroon");
    setFormOccasion("Festive Wear");
    setFormDesc("");
    setFormCare("Dry Clean Recommended.");
    setFormImageUrl("");
    setSelectedProduct(null);
  };

  return (
    <div className="container" style={{ paddingTop: "40px", marginBottom: "60px" }}>
      
      {/* Title */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "36px" }}>Owner Admin Dashboard</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Weaving Mill Management & Order Dispatch Center • Authorized Administrator
        </p>
      </div>

      {/* Analytics widgets grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "24px",
        marginBottom: "40px"
      }}>
        {/* Sales */}
        <div className="glass-card" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            color: "#22c55e",
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Total Net Sales</span>
            <h3 style={{ fontSize: "22px", color: "var(--text-dark)", marginTop: "4px" }}>₹{totalSales.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        {/* Pending Orders count */}
        <div className="glass-card" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            backgroundColor: "rgba(234, 179, 8, 0.1)",
            color: "#eab308",
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <ClipboardList size={24} />
          </div>
          <div>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Pending Fulfilments</span>
            <h3 style={{ fontSize: "22px", color: "var(--text-dark)", marginTop: "4px" }}>{pendingOrders} Orders</h3>
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="glass-card" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Loom Stock Alerts</span>
            <h3 style={{ fontSize: "22px", color: "var(--text-dark)", marginTop: "4px" }}>{lowStockItems} Items Low</h3>
          </div>
        </div>
      </div>

      {/* Grid: Order Fullfilment List + Stock Count Manager */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.8fr 1fr",
        gap: "40px"
      }} className="admin-layout">
        
        {/* Order Fulfillment list */}
        <div className="glass-card" style={{ padding: "32px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px"
          }}>
            <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ClipboardList size={20} style={{ color: "var(--accent-gold)" }} /> Order List
            </h2>

            {/* Order Search Box */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "var(--bg-white)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-sm)",
              padding: "6px 10px",
              width: "200px"
            }} className="admin-search-box">
              <Search size={14} style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search orders, clients..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: "12px",
                  color: "var(--text-dark)",
                  width: "100%",
                  background: "transparent"
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {orders.filter(order => {
              const query = orderSearchQuery.toLowerCase();
              const cName = order.customer_name || order.customerName || "Guest";
              return orderSearchQuery === "" ||
                order.id.toLowerCase().includes(query) ||
                cName.toLowerCase().includes(query) ||
                order.email.toLowerCase().includes(query) ||
                order.type.toLowerCase().includes(query);
            }).map((order) => {
              const cName = order.customer_name || order.customerName || "Guest";
              return (
              <div 
                key={order.id}
                style={{
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-sm)",
                  padding: "20px"
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "10px",
                  borderBottom: "1px solid var(--border-light)",
                  paddingBottom: "12px",
                  marginBottom: "12px"
                }}>
                  <div>
                    <strong style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      Order: {order.id} 
                      <span className="badge badge-gold" style={{ fontSize: "10px" }}>{order.type}</span>
                    </strong>
                    <span style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Customer: {cName} • {order.email}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="badge" style={{
                      fontSize: "11px",
                      backgroundColor: order.payment_status === "Paid" ? "#e6f9ed" : "#fee2e2",
                      color: order.payment_status === "Paid" ? "#10b981" : "#ef4444"
                    }}>
                      Payment: {order.payment_status || "Unpaid"}
                    </span>
                    <span className="badge" style={{
                      fontSize: "11px",
                      backgroundColor: order.status === "Delivered" ? "#e6f9ed" : order.status === "Shipped" ? "#e0f2fe" : order.status === "Cancelled" ? "#fee2e2" : "#fef3c7",
                      color: order.status === "Delivered" ? "#10b981" : order.status === "Shipped" ? "#0284c7" : order.status === "Cancelled" ? "#ef4444" : "#d97706"
                    }}>
                      {order.status}
                    </span>
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border-light)",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor: "var(--bg-white)",
                        color: "var(--text-dark)",
                        outline: "none",
                        cursor: "pointer"
                      }}
                    >
                      <option value="Pending Inquiry">Pending Inquiry</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifycontent: "space-between", justifyContent: "space-between" }}>
                      <span>{item.productName} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "12px",
                  borderTop: "1px dashed var(--border-light)",
                  paddingTop: "12px",
                  fontWeight: "700"
                }}>
                  <span>Receipt Total</span>
                  <span style={{ color: "var(--primary-maroon)" }} className="price-tag">₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )
          })}
          </div>
        </div>

        {/* Stock Count Manager */}
        <div className="glass-card" style={{ padding: "32px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Package size={20} style={{ color: "var(--accent-gold)" }} /> Stock Levels
            </h2>
            <button
              onClick={openAddModal}
              className="btn btn-gold"
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                minHeight: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Plus size={14} /> Add Saree
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {products.map((product) => (
              <div 
                key={product.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid var(--border-light)"
                }}
              >
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{
                      width: "44px",
                      height: "44px",
                      objectFit: "cover",
                      borderRadius: "var(--radius-sm)"
                    }} 
                  />
                  <div>
                    <h4 style={{ fontSize: "13px", fontWeight: "700" }}>{product.name}</h4>
                    <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)" }}>
                      SKU: {product.sku} • ₹{product.price}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="badge" style={{
                    backgroundColor: product.stock === 0 ? "#ffeeef" : product.stock <= 2 ? "#fff9e6" : "#e6f9ed",
                    color: product.stock === 0 ? "#ef4444" : product.stock <= 2 ? "#d97706" : "#10b981",
                    fontWeight: "800"
                  }}>
                    {product.stock} left
                  </span>
                  
                  {/* Actions buttons */}
                  <button 
                    onClick={() => openEditModal(product)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px" }}
                    aria-label="Edit product details"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "4px" }}
                    aria-label="Delete product"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <section className="glass-card" style={{ padding: "28px", marginTop: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
          <div>
            <h2 style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}><History size={20} style={{ color: "var(--accent-gold)" }} /> Catalog activity</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>Recent saree additions and changes, including their uploaded photographs.</p>
          </div>
          <button type="button" className="btn btn-outline" onClick={fetchCreationHistory} style={{ minHeight: "auto", padding: "7px 10px", fontSize: "12px" }}>Refresh</button>
        </div>
        {creationHistory.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>No catalog activity yet. Add your first saree to begin the history.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            {creationHistory.map((item) => (
              <article key={item.id} style={{ display: "flex", gap: "10px", border: "1px solid var(--border-light)", borderRadius: "10px", padding: "10px", background: "var(--bg-cream)" }}>
                {item.image && <img src={item.image.startsWith("/") ? `http://localhost:8000${item.image}` : item.image} alt="" style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "8px" }} />}
                <div style={{ minWidth: 0 }}>
                  <strong style={{ fontSize: "13px", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.product_name}</strong>
                  <span style={{ color: "var(--primary-maroon)", fontSize: "12px", fontWeight: "700" }}>{item.action}</span>
                  <time style={{ color: "var(--text-muted)", fontSize: "11px", display: "block", marginTop: "3px" }}>{new Date(item.created_at).toLocaleString()}</time>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* --- ADD PRODUCT MODAL --- */}
      {showAddModal && (
        <div style={modalOverlayStyle} onClick={() => setShowAddModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3>Add New Saree to Loom Catalog</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleCreateProduct} style={formLayoutGrid}>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Saree Name</label>
                <input required type="text" className="form-input" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Classic Maroon Zari Gadwal Saree" />
              </div>
              <div className="form-group">
                <label className="form-label">SKU</label>
                <input required type="text" className="form-input" value={formSku} onChange={(e) => setFormSku(e.target.value)} placeholder="e.g. SS-GW-SLK-009" />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input required type="number" className="form-input" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Level</label>
                <input required type="number" className="form-input" value={formStock} onChange={(e) => setFormStock(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Weave Type</label>
                <select className="form-input" value={formWeave} onChange={(e) => setFormWeave(e.target.value)}>
                  <option value="Gadwal Semi Silk">Gadwal Semi Silk</option>
                  <option value="Gadwal Semi Cicco">Gadwal Semi Cicco</option>
                  <option value="Kanchipuram Style">Kanchipuram Style</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fabric</label>
                <select className="form-input" value={formFabric} onChange={(e) => setFormFabric(e.target.value)}>
                  <option value="Semi Silk">Semi Silk</option>
                  <option value="Semi Cicco">Semi Cicco</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Primary Color</label>
                <select className="form-input" value={formColor} onChange={(e) => setFormColor(e.target.value)}>
                  <option value="Maroon">Maroon</option>
                  <option value="Emerald Green">Emerald Green</option>
                  <option value="Mustard Gold">Mustard Gold</option>
                  <option value="Peacock Blue">Peacock Blue</option>
                  <option value="Violet">Violet</option>
                  <option value="Orange">Orange</option>
                  <option value="Black">Black</option>
                  <option value="Pink">Pink</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Occasion</label>
                <select className="form-input" value={formOccasion} onChange={(e) => setFormOccasion(e.target.value)}>
                  <option value="Wedding Wear">Wedding Wear</option>
                  <option value="Festive Wear">Festive Wear</option>
                  <option value="Daily Wear">Daily Wear</option>
                </select>
              </div>
              <div className="form-group">
                <ImageDropzone value={formImageUrl} onChange={setFormImageUrl} />
              </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Description</label>
                <textarea className="form-input" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} style={{ height: "60px", resize: "none" }} />
              </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Care Instructions</label>
                <input type="text" className="form-input" value={formCare} onChange={(e) => setFormCare(e.target.value)} />
              </div>
              
              <div style={{ gridColumn: "span 2", display: "flex", justifycontent: "flex-end", gap: "10px", marginTop: "12px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Saree</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PRODUCT MODAL --- */}
      {showEditModal && selectedProduct && (
        <div style={modalOverlayStyle} onClick={() => setShowEditModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3>Modify Saree: {selectedProduct.name}</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleEditProduct} style={formLayoutGrid}>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Saree Name</label>
                <input required type="text" className="form-input" value={formName} onChange={(e) => setFormName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">SKU</label>
                <input required type="text" className="form-input" value={formSku} onChange={(e) => setFormSku(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input required type="number" className="form-input" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Level</label>
                <input required type="number" className="form-input" value={formStock} onChange={(e) => setFormStock(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Weave Type</label>
                <select className="form-input" value={formWeave} onChange={(e) => setFormWeave(e.target.value)}>
                  <option value="Gadwal Semi Silk">Gadwal Semi Silk</option>
                  <option value="Gadwal Semi Cicco">Gadwal Semi Cicco</option>
                  <option value="Kanchipuram Style">Kanchipuram Style</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fabric</label>
                <select className="form-input" value={formFabric} onChange={(e) => setFormFabric(e.target.value)}>
                  <option value="Semi Silk">Semi Silk</option>
                  <option value="Semi Cicco">Semi Cicco</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Primary Color</label>
                <select className="form-input" value={formColor} onChange={(e) => setFormColor(e.target.value)}>
                  <option value="Maroon">Maroon</option>
                  <option value="Emerald Green">Emerald Green</option>
                  <option value="Mustard Gold">Mustard Gold</option>
                  <option value="Peacock Blue">Peacock Blue</option>
                  <option value="Violet">Violet</option>
                  <option value="Orange">Orange</option>
                  <option value="Black">Black</option>
                  <option value="Pink">Pink</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Occasion</label>
                <select className="form-input" value={formOccasion} onChange={(e) => setFormOccasion(e.target.value)}>
                  <option value="Wedding Wear">Wedding Wear</option>
                  <option value="Festive Wear">Festive Wear</option>
                  <option value="Daily Wear">Daily Wear</option>
                </select>
              </div>
              <div className="form-group">
                <ImageDropzone value={formImageUrl} onChange={setFormImageUrl} />
              </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Description</label>
                <textarea className="form-input" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} style={{ height: "60px", resize: "none" }} />
              </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Care Instructions</label>
                <input type="text" className="form-input" value={formCare} onChange={(e) => setFormCare(e.target.value)} />
              </div>
              
              <div style={{ gridColumn: "span 2", display: "flex", gap: "10px", marginTop: "12px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .admin-layout {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
      `}</style>
    </div>
  );
}

// Modal CSS setups styled in JS
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  zIndex: 1000000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px"
};

const modalContentStyle = {
  backgroundColor: "var(--bg-white)",
  color: "var(--text-dark)",
  borderRadius: "var(--radius-md)",
  border: "2px solid var(--accent-gold)",
  width: "100%",
  maxWidth: "580px",
  padding: "28px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  maxHeight: "90vh",
  overflowY: "auto"
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid var(--border-light)",
  paddingBottom: "12px",
  marginBottom: "20px"
};

const formLayoutGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px"
};
