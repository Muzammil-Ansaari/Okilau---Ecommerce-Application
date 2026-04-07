import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axios";

const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/products?search=${query}`);
        setResults(data.slice(0, 6));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // debouncing — wait 400ms
    const timer = setTimeout(fetchResults, 400);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute left-0 right-0 top-full z-50 bg-white shadow-xl">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <Search size={18} className="shrink-0 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 text-sm outline-none placeholder:text-gray-300"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-gray-400 hover:text-black"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results */}
        {query.trim().length > 1 && (
          <div className="max-h-[400px] overflow-y-auto">
            {/* Loading */}
            {loading && (
              <div className="px-6 py-8 text-center text-sm text-gray-400">
                Searching...
              </div>
            )}

            {/* No results */}
            {!loading && results.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-gray-400">
                No products found for "{query}"
              </div>
            )}

            {/* Results list */}
            {!loading && results.length > 0 && (
              <div className="py-2">
                <p className="px-6 py-2 text-xs uppercase tracking-widest text-gray-400">
                  {results.length} result{results.length > 1 ? "s" : ""} found
                </p>
                {results.map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-[#F5F5F5]"
                  >
                    <div className="h-14 w-12 shrink-0 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <p className="line-clamp-1 text-sm font-medium text-black">
                        {product.title}
                      </p>
                      <p className="text-xs capitalize text-gray-400">
                        {product.category}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-black">
                      Rs. {product.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Default hint */}
        {query.trim().length <= 1 && (
          <div className="px-6 py-6 text-center text-xs text-gray-300">
            Type at least 2 characters to search
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
