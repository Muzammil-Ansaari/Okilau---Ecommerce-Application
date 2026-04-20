import { Link } from "react-router-dom";
import { Heart, X, ShoppingBag } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Button from "../components/UI/Button";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, openSidebar } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
        <Heart size={64} className="text-gray-200" />
        <h2 className="font-['Anton'] text-2xl uppercase tracking-widest text-black">
          Your Wishlist is Empty
        </h2>
        <p className="text-sm text-gray-400">
          Save items you love to your wishlist.
        </p>
        <Link to="/products">
          <Button variant="black">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen px-4 py-12 sm:px-8 lg:px-16">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <h1 className="font-['Anton'] text-3xl uppercase tracking-widest text-black sm:text-4xl">
          My Wishlist
          <span className="ml-3 text-lg text-gray-400">
            ({wishlistItems.length})
          </span>
        </h1>
        <button
          onClick={clearWishlist}
          className="text-sm text-gray-400 underline underline-offset-4 transition-colors hover:text-black"
        >
          Clear All
        </button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {wishlistItems.map((item) => (
          <div key={item._id} className="group relative flex flex-col">
            {/* Image */}
            <div className="relative overflow-hidden">
              <Link to={`/products/${item._id}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-64 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              <button
                onClick={() => removeFromWishlist(item._id)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-black hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            {/* Product Info */}
            <div className="mt-3 flex flex-col gap-1">
              <Link
                to={`/products/${item._id}`}
                className="text-sm font-semibold text-black hover:underline"
              >
                {item.title}
              </Link>
              <p className="text-sm font-medium text-gray-600">
                $ {item.price.toLocaleString()}
              </p>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-3">
              <Button
                variant="gray"
                className="w-full"
                disabled={item.stock === 0}
                onClick={() => {
                  if (item.stock === 0) return;
                  addToCart({ ...item, size: "M" });
                  openSidebar();
                  clearWishlist();
                }}
              >
                <ShoppingBag size={14} />
                {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Wishlist;
