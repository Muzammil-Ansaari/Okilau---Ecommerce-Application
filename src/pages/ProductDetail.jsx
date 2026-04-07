import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Button from "../components/UI/Button";
import axiosInstance from "../utils/axios";

const SIZES = ["S", "M", "L", "XL"];

const ProductDetail = () => {
  const { id } = useParams();

  const { addToCart, openSidebar } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  // ── Fetch product from API ──
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // reset selections when product changes
        setSelectedImage(0);
        setSelectedSize("");
        setSelectedColor("");
        setQty(1);
        setSizeError(false);

        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data);

        // fetch related products — same category
        const { data: allProducts } = await axiosInstance.get(
          `/products?category=${data.category}`,
        );
        setRelatedProducts(allProducts.filter((p) => p._id !== id).slice(0, 4));
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
      qty,
    });
    openSidebar();
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm uppercase tracking-widest text-gray-400">
          Loading...
        </p>
      </div>
    );
  }

  // ── Error state ──
  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h2 className="font-['Anton'] text-2xl uppercase tracking-widest">
          Product Not Found
        </h2>
        <Link to="/products">
          <Button variant="black">Back to Products</Button>
        </Link>
      </div>
    );
  }

  // images — use product.images array or fallback to single image
  const images = product.images?.length > 0 ? product.images : [product.image];

  return (
    <section className="min-h-screen px-4 py-12 sm:px-8 lg:px-16">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-xs text-gray-400">
        <Link to="/" className="hover:text-black">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-black">
          Products
        </Link>
        <span>/</span>
        <span className="text-black">{product.title}</span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* ── Left — Image Gallery ── */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="h-125 w-full object-cover object-center transition-all duration-500"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 shrink-0 overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? "border-black"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right — Product Details ── */}
        <div className="flex flex-col gap-6">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            {product.category}
          </p>

          <h1 className="font-['Anton'] text-3xl uppercase tracking-wide text-black sm:text-4xl">
            {product.title}
          </h1>

          <p className="text-2xl font-bold text-black">
            Rs. {product.price.toLocaleString()}
          </p>

          <div className="border-t border-gray-100" />

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-medium text-black">
                Color:{" "}
                <span className="font-normal text-gray-500">
                  {selectedColor || "Select a color"}
                </span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-black scale-110"
                        : "border-transparent hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-black">
                Size:{" "}
                <span className="font-normal text-gray-500">
                  {selectedSize || "Select a size"}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  className={`flex h-10 w-12 items-center justify-center border text-sm font-medium transition-all duration-200 ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-black hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="mt-2 text-xs text-red-500">
                Please select a size before adding to cart.
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          <div>
            <p className="mb-3 text-sm font-medium text-black">Quantity</p>
            <div className="flex w-fit items-center border border-gray-200">
              <button
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                className="flex h-10 w-10 items-center justify-center text-gray-500 transition-colors hover:bg-black hover:text-white"
              >
                <Minus size={14} />
              </button>
              <span className="w-12 text-center text-sm font-medium">
                {qty}
              </span>
              <button
                onClick={() =>
                  setQty((prev) => Math.min(product.stock, prev + 1))
                }
                disabled={qty >= product.stock}
                className="flex h-10 w-10 items-center justify-center text-gray-500 transition-colors hover:bg-black hover:text-white"
              >
                <Plus size={14} />
              </button>
              
              {product.stock > 0 && product.stock <= 10 && (
                <p className="text-xs text-red-500">
                  Only {product.stock} left in stock!
                </p>
              )}
              
              {product.stock === 0 && (
                <p className="text-xs text-red-500">Out of stock</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="black"
              className="w-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingBag size={16} />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button
              variant="gray"
              className="w-full"
              onClick={() => toggleWishlist(product)}
            >
              <Heart
                size={16}
                className={
                  isWishlisted(product._id) ? "fill-red-500 text-red-500" : ""
                }
              />
              {isWishlisted(product._id) ? "Wishlisted" : "Add to Wishlist"}
            </Button>
          </div>

          <div className="border-t border-gray-100" />

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-black">
                Description
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-8 font-['Anton'] text-2xl uppercase tracking-widest text-black">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link
                key={item._id}
                to={`/products/${item._id}`}
                className="group flex flex-col gap-2"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-60 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="text-sm font-semibold text-black group-hover:underline">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500">
                  Rs. {item.price.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetail;
