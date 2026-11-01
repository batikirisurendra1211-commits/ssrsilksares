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

import api from "./api/apiClient";

const imageMap = {
  saree1Img,
  saree2Img,
  saree3Img,
};
const API_ORIGIN = "http://localhost:8000";

const resolveProductImage = (image) => {
  if (image?.startsWith("http://") || image?.startsWith("https://")) return image;
  if (image?.startsWith("/uploads/")) return `${API_ORIGIN}${image}`;
  return imageMap[image] || saree1Img;
};

export default function App() {
  const [currentTab, setCurrentTab] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [orders, setOrders] = useState([]);

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
      if (Array.isArray(data)) {
        const mapped = data.map((p) => ({
          ...p,
          image: resolveProductImage(p.image),
        }));
        setProductsList(mapped);
      }
    } catch (e) {
      console.warn("Failed to fetch products from backend:", e);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await api.orders.getAll();
      if (Array.isArray(data)) {
        setOrders(data);
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

  // Sync orders whenever user logs in or out
  useEffect(() => {
    if (currentUser) {
      fetchOrders();
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
