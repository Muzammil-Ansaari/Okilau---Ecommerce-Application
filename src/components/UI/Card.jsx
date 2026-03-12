import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Button from "./Button";

const Card = ({ id, title, price, image }) => {
  return (
    <div className="group flex flex-col justify-between border border-[#d0d0d0]/50 p-2 shadow-sm transition-all duration-300 hover:shadow-xl text-center">

      {/* Image */}
      <div className="relative h-60 overflow-hidden cursor-pointer">
        <Link to={`/products/${id}`}>
          <img
            className="h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-110"
            src={image}
            alt={title}
          />
        </Link>

        {/* Wishlist icon on hover */}
        <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 hover:bg-black hover:text-white">
          <Heart size={14} />
        </button>
      </div>

      {/* Title */}
      <p className="mt-2 cursor-pointer font-semibold transition-all duration-300 hover:text-gray-600">
        {title}
      </p>

      {/* Price */}
      <p className="text-lg font-medium text-gray-600">{price}</p>

      {/* Button */}
      <Button variant="gray">Select Options</Button>

    </div>
  );
};

export default Card;