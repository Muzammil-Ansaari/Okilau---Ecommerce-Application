import React from "react";
import { assets } from "../assets/assets";
import { Instagram } from "lucide-react";

const images = [
  "https://res.cloudinary.com/dm6dltg3s/image/upload/v1775458828/gallery_image_01_w0txgf.jpg",
  "https://res.cloudinary.com/dm6dltg3s/image/upload/v1775458827/gallery_image_02_z0j2a8.jpg",
  "https://res.cloudinary.com/dm6dltg3s/image/upload/v1775458828/gallery_image_03_m8lmwo.jpg",
  "https://res.cloudinary.com/dm6dltg3s/image/upload/v1775458827/gallery_image_04_n3m0fx.jpg",
  "https://res.cloudinary.com/dm6dltg3s/image/upload/v1775458827/gallery_image_05_anhk3s.jpg",
  "https://res.cloudinary.com/dm6dltg3s/image/upload/v1775458828/gallery_image_06_hzwugs.jpg",
];

const InstagramGallery = () => {
  return (
    <section className="my-20">
      {/* Gallery Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6">
        {images.map((image, index) => (
          <a
            key={index}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden"
          >
            {/* Image */}
            <img
              src={image}
              alt={`Okilau Instagram ${index + 1}`}
              className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-52"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Instagram size={28} className="text-white" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default InstagramGallery;
