import { Link } from "react-router-dom";
import Button from "../components/UI/Button";

const About = () => {
  return (
    <section className="min-h-screen">

      {/* ── Hero Banner ── */}
      <div className="relative flex h-48 items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
            Who We Are
          </p>
          <h1 className="font-['Anton'] text-4xl uppercase tracking-widest text-black sm:text-6xl">
            About Okilau
          </h1>
        </div>
      </div>

      {/* ── Brand Story ── */}
      <div className="px-4 py-15 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* Image — left */}
          <div className="overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop"
              alt="Okilau Story"
              className="h-125 w-full object-cover object-center"
            />
          </div>

          {/* Text — right */}
          <div className="flex flex-col gap-6">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Our Story
            </p>
            <h2 className="font-['Anton'] text-3xl uppercase tracking-wide text-black sm:text-4xl">
              Wear Your Story
            </h2>
            <p className="text-sm leading-relaxed text-gray-500">
              Okilau was born from a simple belief — that clothing is more than
              just fabric. It's a form of self-expression, a way to tell the
              world who you are without saying a word. We started as a small
              team of fashion enthusiasts who were tired of choosing between
              style and comfort.
            </p>
            <p className="text-sm leading-relaxed text-gray-500">
              Today, Okilau brings thoughtfully designed pieces for men, women,
              and kids — crafted with quality materials and a focus on timeless
              style. Every piece in our collection is chosen with intention,
              ensuring that what you wear reflects who you truly are.
            </p>
            <p className="text-sm leading-relaxed text-gray-500">
              We believe fashion should be accessible, sustainable, and
              personal. That's why we're committed to offering pieces that don't
              just look good — but feel good too.
            </p>
            <div className="pt-2">
              <Link to="/products">
                <Button variant="black">Shop the Collection</Button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ── Mission Statement ── */}
      <div className="bg-black px-4 py-20 text-center sm:px-8 lg:px-16 mb-15">
        <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
          Our Mission
        </p>
        <h2 className="mx-auto max-w-3xl font-['Anton'] text-3xl uppercase tracking-wide text-white sm:text-4xl">
          To make every person feel confident, comfortable, and uniquely
          themselves through the power of fashion.
        </h2>
      </div>

    </section>
  );
};

export default About;