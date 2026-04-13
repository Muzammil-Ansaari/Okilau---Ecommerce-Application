import Button from "./UI/Button";
import Card from "./UI/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";

const TrendingProducts = () => {
  const { products, loading, error } = useProducts({ sort: "newest" });

  const trendingProducts = products.filter((p) => p.trending);

  return (
    <section className="my-20 px-4 md:px-8 lg:px-24 text-center">
      <h2 className="mb-8 text-center font-['Anton'] text-4xl uppercase tracking-wide text-black">
        Trending This Week
      </h2>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-10">
          <p className="text-sm text-gray-400 tracking-widest uppercase">
            Loading...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && <p className="py-10 text-sm text-red-400">{error}</p>}

      {/* Products */}
      {!loading && !error && (
        <Swiper
          spaceBetween={16}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 12 },
            640: { slidesPerView: 2.2, spaceBetween: 16 },
            768: { slidesPerView: 3.2, spaceBetween: 16 },
            1024: { slidesPerView: 4.2, spaceBetween: 20 },
          }}
        >
          {trendingProducts.map((product) => (
            <SwiperSlide key={product._id} style={{ height: "auto" }}>
              <Card product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <Link to={"/products"}>
        <Button className="mt-10" variant="black">
          View All Products
        </Button>
      </Link>
    </section>
  );
};

export default TrendingProducts;
