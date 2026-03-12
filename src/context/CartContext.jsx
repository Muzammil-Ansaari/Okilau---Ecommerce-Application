import { createContext, useContext, useState, useEffect } from "react";

// Step 1 — Create the context
const CartContext = createContext();

// Step 2 — Create the Provider
export const CartProvider = ({ children }) => {
  // load cart from localStorage so it persists on refresh
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("okilau-cart");
    return saved ? JSON.parse(saved) : [];
  });

  // sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // save to localStorage every time cartItems changes
  useEffect(() => {
    localStorage.setItem("okilau-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ── Sidebar controls ──
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  // ── Add to Cart ──
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find(
        (item) => item.id === product.id && item.size === product.size
      );

      if (exists) {
        return prev.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  // ── Remove from Cart ──
  const removeFromCart = (id, size) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.size === size))
    );
  };

  // ── Update Quantity ──
  const updateQty = (id, size, qty) => {
    if (qty <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, qty } : item
      )
    );
  };

  // ── Clear Cart ──
  const clearCart = () => setCartItems([]);

  // ── Cart Total ──
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  // ── Cart Count ──
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartTotal,
        cartCount,
        isSidebarOpen,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Step 3 — Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};