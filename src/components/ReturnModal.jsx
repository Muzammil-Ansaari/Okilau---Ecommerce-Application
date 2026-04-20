import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";
import axiosInstance from "../utils/axios";

const RETURN_REASONS = [
  "Wrong item received",
  "Item is damaged",
  "Item is defective",
  "Item doesn't match description",
  "Changed my mind",
  "Other",
];

const ReturnModal = ({ order, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  // ── unique key for each item — product + size + color ──
  const itemKey = (item) =>
    `${item.product}-${item.size || ""}-${item.color || ""}`;

  // ── check if item is selected ──
  const isItemSelected = (item) =>
    selectedItems.some((i) => itemKey(i) === itemKey(item));

  // ── get selected item ──
  const getSelectedItem = (item) =>
    selectedItems.find((i) => itemKey(i) === itemKey(item));

  // ── Toggle item — default qty = 1 ──
  const toggleItem = (item) => {
    setSelectedItems((prev) => {
      const exists = prev.some((i) => itemKey(i) === itemKey(item));
      if (exists) return prev.filter((i) => itemKey(i) !== itemKey(item));
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // ── Update return qty ──
  const updateReturnQty = (item, newQty) => {
    setSelectedItems((prev) =>
      prev.map((i) =>
        itemKey(i) === itemKey(item) ? { ...i, qty: newQty } : i,
      ),
    );
  };

  // ── Calculate refund for selected items only ──
  const refundAmount = selectedItems.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      setError("Please select at least one item to return");
      return;
    }
    if (!reason) {
      setError("Please select a reason");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(
        "/returns",
        {
          orderId: order._id,
          items: selectedItems,
          reason,
          description,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="font-['Anton'] text-lg uppercase tracking-widest text-black">
            Request Return
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          {/* Order info */}
          <div className="bg-[#F5F5F5] p-3">
            <p className="text-xs text-gray-400">Order</p>
            <p className="text-sm font-medium text-black">
              #{order._id}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {order.items.length} item{order.items.length > 1 ? "s" : ""} · ${" "}
              {order.totalPrice.toLocaleString()}
            </p>
          </div>

          {/* Items Selection */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Select Items to Return
            </p>

            {order.items.map((item, index) => {
              const selected = isItemSelected(item);
              const selectedItem = getSelectedItem(item);

              return (
                <div key={index} className="border-b border-gray-100 py-3">
                  {/* Item row */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleItem(item)}
                      className="h-4 w-4 accent-black shrink-0"
                    />
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-12 w-10 shrink-0 object-cover object-center"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black line-clamp-1">
                        {item.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-1 mt-0.5">
                        {item.size && (
                          <span className="text-xs text-gray-400">
                            Size: {item.size}
                          </span>
                        )}
                        {item.size && item.color && (
                          <span className="text-xs text-gray-300">·</span>
                        )}
                        {item.color && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            Color:
                            <span
                              className="inline-block h-3 w-3 rounded-full border border-gray-200"
                              style={{ backgroundColor: item.color }}
                            />
                          </span>
                        )}
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400">
                          Ordered: {item.qty}
                        </span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400">
                          $ {item.price.toLocaleString()} each
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Qty selector — only when selected AND qty > 1 */}
                  {selected && item.qty > 1 && (
                    <div className="mt-2 ml-7 flex items-center gap-3">
                      <p className="text-xs text-gray-500">
                        How many to return?
                      </p>
                      <div className="flex items-center border border-gray-200">
                        <button
                          type="button"
                          onClick={() =>
                            updateReturnQty(
                              item,
                              Math.max(1, selectedItem.qty - 1),
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {selectedItem.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateReturnQty(
                              item,
                              Math.min(item.qty, selectedItem.qty + 1),
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">max {item.qty}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Refund amount */}
            {selectedItems.length > 0 && (
              <div className="mt-3 flex items-center justify-between bg-[#F5F5F5] px-3 py-2">
                <p className="text-xs text-gray-500">Estimated Refund</p>
                <p className="text-sm font-bold text-black">
                  $ {refundAmount.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-gray-500">
              Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
            >
              <option value="">Select a reason</option>
              {RETURN_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-gray-500">
              Additional Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={3}
              className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-black py-3 text-sm font-medium uppercase tracking-widest text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Return Request"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ReturnModal;
