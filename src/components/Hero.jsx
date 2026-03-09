import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import Button from "./UI/Button";

const Hero = () => {
  return (
    <section className="relative w-full h-150 overflow-hidden">

  {/* Hero Image */}
  <img
    src={assets.heroImg}
    alt="Okilau Hero"
    className="absolute inset-0 w-full h-full object-cover object-right sm:object-center"
  />

  {/* Text Content — Left Side */}
  <div className="absolute inset-0 flex items-center">
    <div className="px-10 sm:px-16 lg:px-24">

      {/* Heading */}
      <h1 className="font-['Anton'] text-3xl sm:text-4xl lg:text-6xl font-semibold tracking-wider lg:leading-18 text-black uppercase mb-4">
        Oversized <br />
        Printed T-Shirts
      </h1>

      {/* Paragraph */}
      <p className="text-sm sm:text-base font-medium text-black mb-8">
        From millions of things designed and sold by artists.
      </p>

      {/* Shop Now Button */}
      <Link to="/products">
        <Button variant="black">Shop Now</Button>
      </Link>

    </div>
  </div>

</section>
  );
};

export default Hero;
