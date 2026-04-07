import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axios";

const CATEGORIES = ["men", "women", "kids"];
const SIZES = ["S", "M", "L", "XL", "XXL"];

// ── Product Form Modal ──
const ProductModal = ({ product, onClose, onSave }) => {
  const { token } = useAuth();
  const isEditing = !!product;

  const [form, setForm] = useState({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "men",
    image: product?.image || "",
    images: product?.images?.join(", ") || "",
    colors: product?.colors?.join(", ") || "",
    sizes: product?.sizes || [],
    trending: product?.trending || false,
    hasVariations: product?.hasVariations || false,
    stock: product?.stock || 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.price || !form.image) {
      setError("Title, price and image are required.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images
          ? form.images.split(",").map((i) => i.trim()).filter(Boolean)
          : [],
        colors: form.colors
          ? form.colors.split(",").map((c) => c.trim()).filter(Boolean)
          : [],
      };

      if (isEditing) {
        await axiosInstance.put(`/products/${product._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axiosInstance.post("/products", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSave(); // refresh list
      onClose(); // close modal
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl overflow-y-auto max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="font-['Anton'] text-lg uppercase tracking-widest text-black">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">

          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-gray-500">
              Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Product title"
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-gray-500">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product description"
              rows={3}
              className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-gray-500">
                Price (Rs.) *
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="1299"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-gray-500">
                Stock
              </label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-gray-500">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Main Image */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-gray-500">
              Main Image URL *
            </label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://cloudinary.com/..."
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
            />
            {form.image && (
              <img
                src={form.image}
                alt="preview"
                className="mt-2 h-20 w-20 object-cover object-center"
              />
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-gray-500">
              Additional Images (comma separated)
            </label>
            <input
              name="images"
              value={form.images}
              onChange={handleChange}
              placeholder="https://url1.com, https://url2.com"
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-gray-500">
              Colors — hex codes (comma separated)
            </label>
            <input
              name="colors"
              value={form.colors}
              onChange={handleChange}
              placeholder="#000000, #ffffff"
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-gray-500">
              Sizes
            </label>
            <div className="flex gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`flex h-9 w-11 items-center justify-center border text-xs font-medium transition-all ${
                    form.sizes.includes(size)
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-black hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="trending"
                checked={form.trending}
                onChange={handleChange}
                className="h-4 w-4 accent-black"
              />
              <span className="text-sm text-gray-600">Trending</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="hasVariations"
                checked={form.hasVariations}
                onChange={handleChange}
                className="h-4 w-4 accent-black"
              />
              <span className="text-sm text-gray-600">Has Variations</span>
            </label>
          </div>

          {/* Error */}
          {error && <p className="text-xs text-red-500">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-black py-3 text-sm font-medium uppercase tracking-widest text-white transition-all hover:bg-gray-800 disabled:opacity-60"
          >
            {loading
              ? isEditing ? "Updating..." : "Adding..."
              : isEditing ? "Update Product" : "Add Product"
            }
          </button>

        </form>
      </div>
    </>
  );
};

// ── Admin Products Page ──
const AdminProducts = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/products");
      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosInstance.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts(); // refresh list
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-['Anton'] text-3xl uppercase tracking-widest text-black">
          Products
          <span className="ml-2 text-lg text-gray-400">({products.length})</span>
        </h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm uppercase tracking-widest text-gray-400">Loading...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Trending</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50">

                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-10 shrink-0 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <p className="line-clamp-1 font-medium text-black max-w-[200px]">
                        {product.title}
                      </p>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 capitalize text-gray-600">
                    {product.category}
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 font-medium text-black">
                    Rs. {product.price.toLocaleString()}
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4">
                    <span className={`font-medium ${product.stock === 0 ? "text-red-500" : "text-green-500"}`}>
                      {product.stock === 0 ? "Out of stock" : product.stock}
                    </span>
                  </td>

                  {/* Trending */}
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      product.trending
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {product.trending ? "Yes" : "No"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="flex min-h-[20vh] items-center justify-center">
              <p className="text-sm text-gray-400">No products found.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ProductModal
          product={editProduct}
          onClose={() => {
            setModalOpen(false);
            setEditProduct(null);
          }}
          onSave={fetchProducts}
        />
      )}

    </div>
  );
};

export default AdminProducts;