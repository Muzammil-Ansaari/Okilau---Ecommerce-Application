import { createContext, useContext, useState, useEffect } from "react";

// Step 1 — Create the context
const WishlistContext = createContext();

// Step 2 — Create the Provider
export const WishlistProvider = ({ children }) => {
  // load wishlist from localStorage so it persists on refresh
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("okilau-wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // save to localStorage every time wishlistItems changes
  useEffect(() => {
    localStorage.setItem("okilau-wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // ── Add to Wishlist ──
  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev; // already in wishlist → do nothing
      return [...prev, product];
    });
  };

  // ── Remove from Wishlist ──
  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ── Toggle Wishlist (add if not in, remove if in) ──
  const toggleWishlist = (product) => {
    const exists = wishlistItems.find((item) => item.id === product.id);
    if (exists) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // ── Check if product is in wishlist ──
  const isWishlisted = (id) => wishlistItems.some((item) => item.id === id);

  // ── Wishlist Count ──
  const wishlistCount = wishlistItems.length;

  const clearWishlist = () => setWishlistItems([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
        wishlistCount,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Step 3 — Custom hook for easy access
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return context;
};
