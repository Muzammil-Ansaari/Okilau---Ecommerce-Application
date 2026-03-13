import { Link } from "react-router-dom";

const CategoriesCard = ({ category }) => {
  return (
    <Link to={`/products?category=${category.title.toLowerCase()}`}>
      <div className="flex flex-col gap-3 items-center cursor-pointer">
        <div className="w-72 h-72 sm:w-60 sm:h-60 md:w-40 md:h-40 overflow-hidden">
          <img
            className="w-full h-full hover:scale-110 transition-all duration-300"
            src={category.image}
            alt={category.title}
          />
        </div>
        <p className="uppercase text-base font-medium">{category.title}</p>
      </div>
    </Link>
  );
};

export default CategoriesCard;
