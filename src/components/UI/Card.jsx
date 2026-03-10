import React from "react";
import Button from "./Button";

const Card = ({id, title, price, image, trending}) => {
  return (
    <div className="w-64 h-100 flex flex-col justify-between p-2 border border-[#d0d0d0]/50 hover:shadow-xl shadow-black/30">
      <div className="h-60 cursor-pointer overflow-hidden">
        <img
          className="w-full h-full object-cover object-center hover:scale-120 transition-all duration-700"
          src={image}
          alt=""
        />
      </div>
      <p className="cursor-pointer font-semibold hover:text-gray-600 transition-all duration-300">
        {title}
      </p>
      <p className="font-medium text-gray-600 text-lg">{price}</p>
      <Button variant="gray">Select Options</Button>
    </div>
  );
};

export default Card;
