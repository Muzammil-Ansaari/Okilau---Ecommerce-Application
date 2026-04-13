import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import Card from "../components/UI/Card";
import { useSearchParams } from "react-router-dom";
import useProducts from "../hooks/useProducts";

const CATEGORIES = ["Men", "Women", "Kids"];
const SIZES = ["S", "M", "L", "XL"];
const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
  { name: "Light Pink", hex: "#E95B8D" },
  { name: "Red", hex: "#DA3F3F" },
];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Popular", value: "popular" },
];

// accordion section for sidebar
const FilterSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-widest text-black"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
};

const Products = () => {
  const [searchParams] = useSearchParams();

  // ── Filter State ──
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const cat = searchParams.get("category");
    return cat ? [cat.charAt(0).toUpperCase() + cat.slice(1)] : [];
  });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // ── Fetch ALL products from API (only sort sent to API) ──
  const { products, loading, error } = useProducts({
    sort: sortBy,
  });

  // ── All filtering done on frontend ──
  const filteredProducts = products.filter((p) => {
    // filter by category
    if (selectedCategories.length > 0) {
      if (
        !selectedCategories
          .map((c) => c.toLowerCase())
          .includes(p.category?.toLowerCase())
      ) {
        return false;
      }
    }

    // filter by size
    if (selectedSizes.length > 0) {
      if (!p.sizes || !p.sizes.some((s) => selectedSizes.includes(s))) {
        return false;
      }
    }

    // filter by color
    if (selectedColors.length > 0) {
      if (!p.colors || !p.colors.some((c) => selectedColors.includes(c))) {
        return false;
      }
    }

    // filter by price
    if (p.price < priceRange[0] || p.price > priceRange[1]) {
      return false;
    }

    return true;
  });

  // ── Toggle helpers ──
  const toggle = (value, list, setList) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  // ── Clear all filters ──
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 10000]);
    setSortBy("newest");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000;

  // ── Sidebar JSX ──
  const Sidebar = () => (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-['Anton'] text-lg uppercase tracking-widest text-black">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 underline underline-offset-4 hover:text-black"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() =>
                  toggle(cat, selectedCategories, setSelectedCategories)
                }
                className="h-4 w-4 accent-black"
              />
              <span className="text-sm text-gray-600">{cat}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="flex flex-col gap-3">
          <input
            type="range"
            min={0}
            max={10000}
            step={100}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full accent-black"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Rs. {priceRange[0].toLocaleString()}</span>
            <span>Rs. {priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggle(size, selectedSizes, setSelectedSizes)}
              className={`flex h-9 w-11 items-center justify-center border text-xs font-medium transition-all ${
                selectedSizes.includes(size)
                  ? "border-black bg-black text-white"
                  : "border-gray-200 text-black hover:border-black"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-3">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() =>
                toggle(color.hex, selectedColors, setSelectedColors)
              }
              title={color.name}
              className={`h-7 w-7 rounded-full border-2 transition-all ${
                selectedColors.includes(color.hex)
                  ? "border-black scale-110"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <section className="min-h-screen px-4 py-12 sm:px-8 lg:px-16">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="font-['Anton'] text-3xl uppercase tracking-widest text-black sm:text-4xl">
          All Products
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {loading ? "Loading..." : `${filteredProducts.length} products found`}
        </p>
      </div>

      <div className="flex gap-10">
        {/* ── Sidebar — desktop only ── */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <Sidebar />
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1">
          {/* Top bar */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 border border-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:border-black lg:hidden"
            >
              <SlidersHorizontal size={14} />
              Filters
              {hasActiveFilters && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
                  !
                </span>
              )}
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-sm text-gray-400 sm:block">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 px-3 py-2 text-sm text-black outline-none focus:border-black"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap gap-2">
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  className="flex items-center gap-1 bg-black px-3 py-1 text-xs text-white"
                >
                  {cat}
                  <button
                    onClick={() =>
                      toggle(cat, selectedCategories, setSelectedCategories)
                    }
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              {selectedSizes.map((size) => (
                <span
                  key={size}
                  className="flex items-center gap-1 bg-black px-3 py-1 text-xs text-white"
                >
                  Size: {size}
                  <button
                    onClick={() =>
                      toggle(size, selectedSizes, setSelectedSizes)
                    }
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              {selectedColors.map((hex) => (
                <span
                  key={hex}
                  className="flex items-center gap-2 bg-black px-3 py-1 text-xs text-white"
                >
                  <span
                    className="h-3 w-3 rounded-full border border-white/30"
                    style={{ backgroundColor: hex }}
                  />
                  Color
                  <button
                    onClick={() =>
                      toggle(hex, selectedColors, setSelectedColors)
                    }
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[40vh] items-center justify-center">
              <p className="text-sm uppercase tracking-widest text-gray-400">
                Loading...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex min-h-[40vh] items-center justify-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && (
            <>
              {filteredProducts.length === 0 ? (
                <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
                  <p className="text-gray-400">
                    No products match your filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-sm underline underline-offset-4 hover:text-gray-600"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <Card key={product._id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto bg-white px-6 py-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-['Anton'] text-lg uppercase tracking-widest">
                Filters
              </h2>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <Sidebar />
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="mt-6 w-full bg-black py-3 text-sm font-medium uppercase tracking-widest text-white"
            >
              Show {filteredProducts.length} Products
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Products;
