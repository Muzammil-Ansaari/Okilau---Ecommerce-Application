import React from "react";
import CategoriesCard from "./UI/CategoriesCard";
import { assets } from "../assets/assets";

const categories = [
    {id: 1, image: assets.apparel, title: "Apparel"},
    {id: 2, image: assets.mug, title: "Mugs"},
    {id: 3, image: assets.marks, title: "Marks"},
    {id: 4, image: assets.phone_cases, title: "Phone Cases"},
    {id: 5, image: assets.doormat, title: "Doormat"},
    {id: 6, image: assets.blanket, title: "Blanket"},
]

const ShopByCategories = () => {
  return (
    <section className="my-20 px-4 md:px-8 lg:px-24 text-center">
      <h2 className="font-['Anton'] font-medium tracking-wide text-black uppercase text-center mb-12 text-4xl">
        shop by categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
        {categories.map((category) => <CategoriesCard key={category.id} category={category} />)}
      </div>
    </section>
  );
};

export default ShopByCategories;
