import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import Button from "./UI/Button";

const Hero = () => {
  return (
    <section className="sm:relative w-full h-150 overflow-hidden">

  {/* Hero Image */}
  <img
    src={assets.heroImg}
    alt="Okilau Hero"
    className="sm:absolute sm:inset-0 w-full h-84 sm:h-screen object-cover object-[70%_center] sm:object-center"
  />

  {/* Text Content — Left Side */}
  <div className="mt-5 sm:mt-0 sm:absolute sm:inset-0 flex items-center justify-center sm:justify-start">
    <div className="px-4 md:px-8 lg:px-24">

      {/* Heading */}
      <h1 className="font-['Anton'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-widest sm:leading-11 md:leading-13 lg:leading-16 text-black uppercase mb-4 text-center sm:text-left ">
        Oversized <br />
        Printed T-Shirts
      </h1>

      {/* Paragraph */}
      <p className="text-base sm:text-base font-medium text-black mb-8 text-center sm:text-left">
        From millions of things designed and sold by artists.
      </p>

      {/* Shop Now Button */}
      <Link to="/products">
        <Button className="w-full sm:w-fit" variant="black">Shop Now</Button>
      </Link>

    </div>
  </div>

</section>
  );
};

export default Hero;
