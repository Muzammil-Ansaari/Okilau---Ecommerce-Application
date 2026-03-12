import React from "react";
import { assets } from "../assets/assets";

const features = [
  {
    id: 1,
    image: assets.feature_icon_01,
    title: "Free Shipping",
    description:
      "Get complimentary ground shipping on every order. Don't love it? Send it back, on us.",
  },
  {
    id: 2,
    image: assets.feature_icon_02,
    title: "Locally Owned",
    description:
      "Join Okilau Rewards to earn gift cards and enjoy exclusive member benefits.",
  },
  {
    id: 3,
    image: assets.feature_icon_03,
    title: "Money Back Guarantee",
    description:
      "We believe getting dressed should be the easiest part of your day.",
  },
];

const Features = () => {
  return (
    <section className="px-4 md:px-8 lg:px-24">
      {/* Heading */}
      <h2 className="mb-16 text-center font-['Anton'] text-2xl uppercase leading-tight tracking-wide text-black sm:text-3xl lg:mx-auto lg:max-w-3xl lg:text-4xl">
        Product Artwork Is Created By Talented Artists From All Around The
        World.
      </h2>

      {/* 3 Features */}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col items-center text-center"
          >
            {/* Image — already circular with bg */}
            <img
              src={feature.image}
              alt={feature.title}
              className="mb-6 h-16 w-16 object-contain"
            />

            {/* Title */}
            <h3 className="mb-3 text-lg font-bold text-black">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="max-w-xs text-base leading-relaxed text-gray-500">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
