import React from "react";
import { products } from "../data/products";
import Card from "./UI/Card";
import Button from "./UI/Button";

const BestiesGiftsProducts = () => {
  return (
    <section className="my-20 px-4 md:px-8 lg:px-24 text-center">
      <h2 className="font-['Anton'] font-medium tracking-wide text-black uppercase text-center mb-4 text-4xl">
        Besties Gifts
      </h2>
      <div className="flex justify-between my-8">
        {products.map((p) => (
          <Card key={p.id} image={p.image} title={p.title} price={p.price} />
        ))}
      </div>
      <Button variant="black">View All Products</Button>
    </section>
  );
};

export default BestiesGiftsProducts;
