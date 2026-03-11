import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";


const promos = [
  {
    id: 1,
    title: "The Rolling Stones",
    buttonText: "Shop Now",
    link: "/products",
    image: assets.promo_card_01,
    bgColor: "bg-black",
    textColor: "text-black",
  },
  {
    id: 2,
    title: "Boss Lady Collection",
    buttonText: "Shop Now",
    link: "/products",
    image: assets.promo_card_02,
    bgColor: "bg-white",
    textColor: "text-white",
  },
  {
    id: 3,
    title: "Wouf Ladies Laptop Case",
    buttonText: "Shop Now",
    link: "/products",
    image: assets.promo_card_03,
    bgColor: "bg-black",
    textColor: "text-black",
  },
];

const PromoCards = () => {
  return (
    <section className="px-4 my-20 md:px-8 lg:px-24">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className={"relative flex h-60 overflow-hidden"}
          >
            {/* Text — top left */}
            <div className="flex flex-col justify-between p-6 w-[50%] sm:w-full md:w-[75%] lg:w-[50%] z-10">
              <h2
                className={`font-['Anton'] text-xl uppercase leading-tight tracking-wide lg:text-2xl cursor-pointer ${promo.textColor}`}
              >
                {promo.title}
              </h2>

              {/* Shop Now - Button */}
              <Link
                to={promo.link}
                className={`relative text-sm font-bold uppercase tracking-widest transition-opacity duration-300 ${promo.textColor} w-fit group`}
              >
                {promo.buttonText}
                <span className={`absolute w-0 h-px -bottom-1 left-0 ${promo.bgColor} transition-all duration-300 group-hover:w-full`}></span>
              </Link>
            </div>

            {/* Image */}
            <div className="absolute top-0 left-0 w-full h-full">
              <img
                src={promo.image}
                alt={promo.title}
                className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromoCards;
