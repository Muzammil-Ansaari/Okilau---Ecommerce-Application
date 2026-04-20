import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axios";

const STATUS_OPTIONS = ["processing", "shipped", "delivered", "cancelled"];

const statusColor = (status) => {
  switch (status) {
    case "processing":
      return "bg-yellow-100 text-yellow-700";
    case "shipped":
      return "bg-blue-100 text-blue-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(
        `/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // update locally without re-fetching
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaymentStatusUpdate = async (orderId, paymentStatus) => {
    try {
      await axiosInstance.put(
        `/orders/${orderId}/payment`,
        { paymentStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // update locally
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, paymentStatus } : o)),
      );
    } catch (error) {
      console.log(error);
    }
  };

  // filter by status
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-['Anton'] text-3xl uppercase tracking-widest text-black">
          Orders
          <span className="ml-2 text-lg text-gray-400">
            ({filteredOrders.length})
          </span>
        </h1>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
          >
            <option value="all">All Orders</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm uppercase tracking-widest text-gray-400">
            Loading...
          </p>
        </div>
      )}

      {/* Orders Table */}
      {!loading && (
        <div className="bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <>
                  {/* Order Row */}
                  <tr
                    key={order._id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-black">
                      #{order._id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-black">
                        {order.user?.name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.user?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 font-medium text-black">
                      $ {order.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(order._id, e.target.value)
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium outline-none cursor-pointer ${statusColor(order.status)}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Payment Status Dropdown */}
                    <td className="px-6 py-4">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          handlePaymentStatusUpdate(order._id, e.target.value)
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium outline-none cursor-pointer ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : order.paymentStatus === "refunded"
                              ? "bg-blue-100 text-blue-700"
                              : order.paymentStatus === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>

                    {/* Expand */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order._id ? null : order._id,
                          )
                        }
                        className="text-xs text-gray-400 underline underline-offset-4 hover:text-black"
                      >
                        {expandedOrder === order._id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Order Items */}
                  {expandedOrder === order._id && (
                    <tr key={`${order._id}-expanded`} className="bg-[#F5F5F5]">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="flex flex-col gap-4">
                          {/* Items */}
                          <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                              Order Items
                            </p>
                            <div className="flex flex-col gap-3">
                              {order.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3"
                                >
                                  <div className="h-14 w-12 shrink-0 overflow-hidden">
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-black">
                                      {item.title}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      Size: {item.size} · Qty: {item.qty}
                                    </p>
                                  </div>
                                  <p className="text-sm font-bold text-black">
                                    ${" "}
                                    {(item.price * item.qty).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                              Shipping Address
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress?.name} ·{" "}
                              {order.shippingAddress?.phone}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress?.address},{" "}
                              {order.shippingAddress?.city},{" "}
                              {order.shippingAddress?.state}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress?.country} ·{" "}
                              {order.shippingAddress?.zip}
                            </p>
                          </div>

                          {/* Total */}
                          <div className="flex items-center gap-6 border-t border-gray-200 pt-3 text-sm">
                            <p className="text-gray-500">
                              Subtotal:{" "}
                              <span className="font-medium text-black">
                                $ {order.totalPrice.toLocaleString()}
                              </span>
                            </p>
                            <p className="text-gray-500">
                              Shipping:{" "}
                              <span className="font-medium text-black">
                                {order.shippingPrice === 0
                                  ? "Free"
                                  : `$ ${order.shippingPrice}`}
                              </span>
                            </p>
                            <p className="text-gray-500">
                              Total:{" "}
                              <span className="font-bold text-black">
                                ${" "}
                                {(
                                  order.totalPrice + order.shippingPrice
                                ).toLocaleString()}
                              </span>
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="flex min-h-[20vh] items-center justify-center">
              <p className="text-sm text-gray-400">No orders found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
