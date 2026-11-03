import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import B2B from "./pages/B2B";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import CheckoutSuccess from "./pages/CheckoutSuccess";

// Product images import to resolve static compilation assets
import saree1Img from "./assets/products/saree-1.png";
import saree2Img from "./assets/products/saree-2.png";
import saree3Img from "./assets/products/saree-3.png";
import { products as defaultProducts } from "./data/products";

import api from "./api/apiClient";

const imageMap = {
  saree1Img,
  saree2Img,
  saree3Img,
};
const resolveProductImage = (image) => {
  if (!image) return saree1Img;
  if (
    image.startsWith("data:image/") ||
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("/uploads/") ||
    image.startsWith("/assets/")
  ) {
    return image;
  }
  return imageMap[image] || image;
};

export default function App() {
  const [currentTab, setCurrentTab] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize products from persistent cache or default catalog so refresh never wipes sarees
  const [productsList, setProductsList] = useState(() => {
    try {
      const cached = localStorage.getItem("ss_products_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => ({
            ...p,
            image: resolveProductImage(p.image),
          }));
        }
      }
    } catch {}
    return defaultProducts.map((p) => ({
      ...p,
      image: resolveProductImage(p.image),
    }));
  });

  // Initialize orders from cache so refresh never wipes customer/admin orders
  const [orders, setOrders] = useState(() => {
    try {
      const cached = localStorage.getItem("ss_orders_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Authenticated user state loaded dynamically from HTTP-only session cookie
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Check active user session on startup via cookie
  const checkSession = async () => {
    try {
      const user = await api.auth.getMe();
      if (user && user.id) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    } catch {
      // Unauthenticated visitor
      setCurrentUser(null);
    } finally {
      setAuthChecking(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await api.products.getAll();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((p) => ({
          ...p,
          image: resolveProductImage(p.image),
        }));
        setProductsList((prev) => {
          const productMap = new Map();
          // 1. Add server products
          mapped.forEach((p) => productMap.set(p.id, p));
          // 2. Preserve any local/custom products that might not be on the server yet
          (prev || []).forEach((p) => {
            if (p && p.id && !productMap.has(p.id)) {
              productMap.set(p.id, p);
            }
          });
          const merged = Array.from(productMap.values());
          try {
            localStorage.setItem("ss_products_cache", JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    } catch (e) {
      console.warn("Failed to fetch products from backend:", e);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await api.orders.getAll();
      if (Array.isArray(data)) {
        setOrders((prev) => {
          // Never wipe out orders if server returns empty
          if (data.length === 0 && prev && prev.length > 0) {
            return prev;
          }
          const orderMap = new Map();
          (prev || []).forEach((o) => {
            if (o && o.id) orderMap.set(o.id, o);
          });
          data.forEach((o) => {
            if (o && o.id) orderMap.set(o.id, o);
          });
          const merged = Array.from(orderMap.values());
          try {
            localStorage.setItem("ss_orders_cache", JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    } catch (e) {
      console.warn("Failed to fetch orders from backend:", e);
    }
  };

  // Run initial data sync
  useEffect(() => {
    checkSession();
    fetchProducts();
    fetchOrders();
  }, []);

  // Sync orders and check for pending cart items whenever user logs in
  useEffect(() => {
    if (currentUser) {
      fetchOrders();
      // Auto-add pending saree after login
      const pendingRaw = sessionStorage.getItem("pending_cart_product");
      if (pendingRaw) {
        try {
          const pendingProduct = JSON.parse(pendingRaw);
          const qty = parseInt(sessionStorage.getItem("pending_cart_qty") || "1", 10);
          sessionStorage.removeItem("pending_cart_product");
          sessionStorage.removeItem("pending_cart_qty");
          setCart((prevCart) => {
            const existing = prevCart.find((item) => item.product.id === pendingProduct.id);
            if (existing) {
              return prevCart.map((item) =>
                item.product.id === pendingProduct.id
                  ? { ...item, quantity: item.quantity + qty }
                  : item
              );
            }
            return [...prevCart, { product: pendingProduct, quantity: qty }];
          });
          setCartOpen(true);
        } catch (e) {
          console.warn("Could not parse pending product:", e);
        }
      }
    }
  }, [currentUser]);

  // Set up Hash Router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#/";
      let route = "home";

      if (hash.startsWith("#/shop")) route = "shop";
      else if (hash.startsWith("#/about")) route = "about";
      else if (hash.startsWith("#/contact")) route = "contact";
      else if (hash.startsWith("#/b2b")) route = "b2b";
      else if (hash.startsWith("#/account")) route = "account";
      else if (hash.startsWith("#/checkout-success")) route = "checkout-success";
      else if (hash.startsWith("#/checkout")) route = "checkout";
      else if (hash.startsWith("#/admin")) route = "admin";

      setCurrentTab(route);
      window.scrollTo(0, 0);
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Handle Dark Mode toggle injection
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    // If not logged in, prompt user to login/register and navigate to Account page
    if (!currentUser) {
      try {
        sessionStorage.setItem("pending_cart_product", JSON.stringify(product));
        sessionStorage.setItem("pending_cart_qty", String(quantity));
      } catch (err) {
        console.warn("Storage warning:", err);
      }
      window.location.hash = "#/account";
      setCurrentTab("account");
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    setCartOpen(true);
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeCartItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeCartItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Render correct page
  const renderPage = () => {
    switch (currentTab) {
      case "home":
        return <Home setCurrentTab={setCurrentTab} addToCart={addToCart} products={productsList} />;
      case "shop":
        return (
          <Shop
            addToCart={addToCart}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            products={productsList}
          />
        );
      case "about":
        return <About setCurrentTab={setCurrentTab} />;
      case "contact":
        return <Contact />;
      case "b2b":
        return (
          <B2B
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            setOrders={setOrders}
          />
        );
      case "account":
        return (
          <Account
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            orders={orders}
            setCurrentTab={setCurrentTab}
            fetchOrders={fetchOrders}
            addToCart={addToCart}
          />
        );
      case "checkout":
        return (
          <Checkout
            cart={cart}
            clearCart={clearCart}
            currentUser={currentUser}
            setOrders={setOrders}
            productsList={productsList}
            setProductsList={setProductsList}
            setCurrentTab={setCurrentTab}
            fetchOrders={fetchOrders}
          />
        );
      case "checkout-success":
        return (
          <CheckoutSuccess
            setCurrentTab={setCurrentTab}
            fetchOrders={fetchOrders}
            clearCart={clearCart}
          />
        );
      case "admin":
        return (
          <Admin
            currentUser={currentUser}
            orders={orders}
            setOrders={setOrders}
            products={productsList}
            setProducts={setProductsList}
            fetchProducts={fetchProducts}
            fetchOrders={fetchOrders}
            setCurrentTab={setCurrentTab}
          />
        );
      default:
        return <Home setCurrentTab={setCurrentTab} addToCart={addToCart} products={productsList} />;
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cart={cart}
        setCartOpen={setCartOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main style={{ paddingBottom: "80px" }}>
        {renderPage()}
      </main>

      {/* Persistent global layout components */}
      <Footer setCurrentTab={setCurrentTab} />
      <WhatsAppButton />
      <ScrollToTop />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        updateQuantity={updateCartQuantity}
        removeItem={removeCartItem}
        setCurrentTab={setCurrentTab}
      />
    </div>
  );
}
