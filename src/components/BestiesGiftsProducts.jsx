import React from "react";
import { products } from "../data/products";
import Card from "./UI/Card";
import Button from "./UI/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

const BestiesGiftsProducts = () => {
  return (
    <section className="my-20 px-4 md:px-8 lg:px-24 text-center">
      <h2 className="mb-8 text-center font-['Anton'] text-4xl uppercase tracking-wide text-black">
        Besties Gifts
      </h2>

      <Swiper
        spaceBetween={16}
        breakpoints={{
          445: { slidesPerView: 1.2, spaceBetween: 12 },
          640: { slidesPerView: 2.2, spaceBetween: 16 },
          768: { slidesPerView: 3.2, spaceBetween: 16 },
          1024: { slidesPerView: 4.2, spaceBetween: 20 },
        }}
      >
        {products
          .filter((p) => p.trending)
          .map((product) => (
            <SwiperSlide key={product._id}>
              <Card
                id={product._id}
                image={product.image}
                title={product.title}
                price={product.price}
              />
            </SwiperSlide>
          ))}
      </Swiper>

      <Link to={"/products"}>
        <Button className="mt-10" variant="black">View All Products</Button>
      </Link>
    </section>
  );
};

export default BestiesGiftsProducts;
