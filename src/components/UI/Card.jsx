import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Button from "./Button";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const Card = ({ product }) => {
  const { _id, title, price, image, stock } = product;
  
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart, openSidebar } = useCart();

  return (
    <div className="h-100 group flex flex-col justify-between border border-[#d0d0d0]/50 p-2 shadow-sm transition-all duration-300 hover:shadow-xl text-center">
      {/* Image */}
      <div className="relative h-60 overflow-hidden cursor-pointer">
        <Link to={`/products/${_id}`}>
          <img
            className="h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-110"
            src={image}
            alt={title}
          />
        </Link>

        {/* Wishlist icon on hover */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 hover:bg-black hover:text-white"
        >
          <Heart
            size={14}
            className={isWishlisted(_id) ? "fill-red-500 text-red-500" : ""}
          />
        </button>
      </div>

      {/* Title */}
      <Link to={`/products/${_id}`}>
        <p className="my-2 cursor-pointer font-semibold transition-all duration-300 hover:text-gray-600">
          {title}
        </p>
      </Link>

      {/* Price */}
      <p className="mb-2 text-lg font-medium text-gray-600">$ {price}</p>

      {/* Button */}
      <Button
        variant="gray"
        disabled={stock === 0}
        onClick={() => {
          if (stock === 0) return;
          addToCart({ ...product, size: "M" });
          openSidebar();
        }}
      >
        {stock === 0 ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  );
};

export default Card;
