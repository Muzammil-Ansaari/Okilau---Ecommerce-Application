import React from 'react'
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import Button from './UI/Button';

const banners = [
  {
    id: 1,
    title: "Print On Demand",
    paragraph: "From millions of things designed and sold by artists.",
    buttonText: "Shop Now",
    link: "/products",
    image: assets.banner1,
    textColor: "text-white",
  },
  {
    id: 2,
    title: "Crossfit",
    paragraph: "Affiliate Gear",
    buttonText: "Shop Now",
    link: "/products",
    image: assets.banner2,
    textColor: "text-black",
  },
];

const PromotionalBanner = () => {
  return (
    <section className="px-4 md:px-8 lg:px-24 my-20">
      <div className="flex flex-col gap-8 md:flex-row">

        {/* Left Banner — 65% */}
        <div className="relative h-100 w-full overflow-hidden md:w-[65%] group">
          <img
            src={assets.banner1}
            alt="Print On Demand"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <h2 className="mb-2 font-['Anton'] text-3xl uppercase tracking-wide text-white lg:text-5xl lg:leading-14">
              Print On <br /> Demand
            </h2>
            <p className="mb-6 text-base font-medium text-white">
              From millions of things designed <br /> and sold by artists.
            </p>
            <Link to="/products">
              <Button variant="black">Shop Now</Button>
            </Link>
          </div>
        </div>

        {/* Right Banner — 35% */}
        <div className="relative h-100 w-full overflow-hidden md:w-[35%] group">
          <img
            src={assets.banner2}
            alt="Crossfit"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <h2 className="mb-2 font-['Anton'] text-3xl uppercase tracking-wide text-black lg:text-4xl">
              Crossfit
            </h2>
            <p className="mb-6 text-base font-medium text-black">
              Affiliate Gear
            </p>
            <Link to="/products">
              <Button variant="black">Shop Now</Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}

export default PromotionalBanner