import Button from "./UI/Button";
import Card from "./UI/Card";
import { products } from "../data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const TrendingProducts = () => {
  return (
    <section className="my-20 px-4 md:px-8 lg:px-24 text-center">
      <h2 className="mb-8 text-center font-['Anton'] text-4xl uppercase tracking-wide text-black">
        Trending This Week
      </h2>

      <Swiper
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 12 },
          640: { slidesPerView: 2.2, spaceBetween: 16 },
          768: { slidesPerView: 3.2, spaceBetween: 16 },
          1024: { slidesPerView: 4.2, spaceBetween: 20 },
        }}
      >
        {products.map((p) => (
          <SwiperSlide key={p.id}>
            <Card id={p.id} image={p.image} title={p.title} price={p.price} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-10">
        <Button variant="black">View All Products</Button>
      </div>
    </section>
  );
};

export default TrendingProducts;
