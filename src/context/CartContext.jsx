import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("okilau-cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("okilau-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const addToCart = (product) => {
    const quantity = product.qty || 1;

    setCartItems((prev) => {
      // 🔥 total qty of this product (all sizes)
      const totalQty = prev
        .filter((item) => item._id === product._id)
        .reduce((sum, item) => sum + item.qty, 0);

      // ❌ block if exceeding stock
      if (totalQty + quantity > product.stock) {
        return prev; // or show toast later
      }

      const exists = prev.find(
        (item) =>
          item._id === product._id &&
          item.size === product.size &&
          item.color === product.color,
      );

      if (exists) {
        return prev.map((item) =>
          item._id === product._id &&
          item.size === product.size &&
          item.color === product.color
            ? { ...item, qty: item.qty + quantity }
            : item,
        );
      }

      return [...prev, { ...product, qty: quantity }];
    });
  };

  const removeFromCart = (id, size, color) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item._id === id && item.size === size && item.color === color),
      ),
    );
  };

  const updateQty = (id, size, color, newQty) => {
    setCartItems((prev) => {
      const targetItem = prev.find(
        (item) => item._id === id && item.size === size && item.color === color,
      );

      if (!targetItem) return prev;

      // 🔥 total qty of this product (all sizes)
      const totalQty = prev
        .filter((item) => item._id === id)
        .reduce((sum, item) => sum + item.qty, 0);

      // ❌ block if exceeding stock
      if (totalQty - targetItem.qty + newQty > targetItem.stock) {
        return prev;
      }

      // remove if 0
      if (newQty <= 0) {
        return prev.filter(
          (item) =>
            !(item._id === id && item.size === size && item.color === color),
        );
      }

      return prev.map((item) =>
        item._id === id && item.size === size && item.color === color
          ? { ...item, qty: newQty }
          : item,
      );
    });
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
