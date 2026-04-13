import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("okilau-wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("okilau-wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) return prev; 
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== id));
  };

  const toggleWishlist = (product) => {
    const exists = wishlistItems.find((item) => item._id === product._id);
    if (exists) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const isWishlisted = (id) => wishlistItems.some((item) => item._id === id);

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

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return context;
};
