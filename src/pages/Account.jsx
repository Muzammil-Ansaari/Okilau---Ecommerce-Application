import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, LogOut, ShoppingBag, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import Button from "../components/UI/Button";
import axiosInstance from "../utils/axios";
import ReturnModal from "../components/ReturnModal";

const Account = () => {
  const { user, token, logout } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("wishlist");

  const [returnModal, setReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const { data } = await axiosInstance.get("/orders/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data);
      } catch (error) {
        console.log(error);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const { data } = await axiosInstance.get("/returns/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReturns(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (token) fetchReturns();
  }, [token]);

  const getOrderReturn = (orderId) =>
    returns.find((r) => r.order._id === orderId || r.order === orderId);

  return (
    <section className="min-h-screen px-4 py-12 sm:px-8 lg:px-16">
      <h1 className="mb-10 font-['Anton'] text-3xl uppercase tracking-widest text-black sm:text-4xl">
        My Account
      </h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ── Left — User Info ── */}
        <div className="lg:col-span-1">
          <div className="bg-[#F5F5F5] p-6">
            {/* Avatar */}
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
              <span className="font-['Anton'] text-2xl uppercase">
                {user?.name?.charAt(0)}
              </span>
            </div>

            <h2 className="font-['Anton'] text-xl uppercase tracking-widest text-black">
              {user?.name}
            </h2>
            <p className="mt-1 text-sm text-gray-400">{user?.email}</p>

            <div className="my-6 border-t border-gray-200" />

            {/* Stats — clickable tabs */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  activeTab === "wishlist" ? "text-black" : "text-gray-400"
                }`}
              >
                <Heart size={18} />
                <p className="text-lg font-bold">{wishlistItems.length}</p>
                <p className="text-xs">Wishlist</p>
              </button>

              <div className="h-10 w-px bg-gray-200" />

              <button
                onClick={() => setActiveTab("orders")}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  activeTab === "orders" ? "text-black" : "text-gray-400"
                }`}
              >
                <ShoppingBag size={18} />
                <p className="text-lg font-bold">{orders.length}</p>
                <p className="text-xs">Orders</p>
              </button>
            </div>

            <div className="my-6 border-t border-gray-200" />

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 text-sm text-gray-400 transition-colors hover:text-black"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* ── Right — Tabs ── */}
        <div className="lg:col-span-2">
          {/* ── Wishlist Tab ── */}
          {activeTab === "wishlist" && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-['Anton'] text-xl uppercase tracking-widest text-black">
                  My Wishlist
                  <span className="ml-2 text-base text-gray-400">
                    ({wishlistItems.length})
                  </span>
                </h2>
                {wishlistItems.length > 0 && (
                  <Link
                    to="/wishlist"
                    className="text-xs text-gray-400 underline underline-offset-4 hover:text-black"
                  >
                    View All
                  </Link>
                )}
              </div>

              {wishlistItems.length === 0 ? (
                <div className="flex min-h-50 flex-col items-center justify-center gap-4 bg-[#F5F5F5]">
                  <Heart size={36} className="text-gray-200" />
                  <p className="text-sm text-gray-400">
                    No items in your wishlist yet.
                  </p>
                  <Link to="/products">
                    <Button variant="black">Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {wishlistItems.slice(0, 6).map((item) => (
                    <div
                      key={item._id}
                      className="group relative flex flex-col gap-2"
                    >
                      <div className="relative overflow-hidden">
                        <Link to={`/products/${item._id}`}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-48 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(item._id)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md text-gray-400 transition-colors hover:text-black"
                        >
                          ×
                        </button>
                      </div>
                      <Link
                        to={`/products/${item._id}`}
                        className="line-clamp-1 text-xs font-semibold text-black hover:underline"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-gray-500">
                        $ {item.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {wishlistItems.length > 6 && (
                <div className="mt-6 text-center">
                  <Link to="/wishlist">
                    <Button variant="gray">
                      View All {wishlistItems.length} Items
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}

          {/* ── Orders Tab ── */}
          {activeTab === "orders" && (
            <>
              <h2 className="mb-6 font-['Anton'] text-xl uppercase tracking-widest text-black">
                My Orders
                <span className="ml-2 text-base text-gray-400">
                  ({orders.length})
                </span>
              </h2>

              {/* Loading */}
              {ordersLoading && (
                <div className="flex min-h-50 items-center justify-center">
                  <p className="text-sm uppercase tracking-widest text-gray-400">
                    Loading...
                  </p>
                </div>
              )}

              {/* Empty */}
              {!ordersLoading && orders.length === 0 && (
                <div className="flex min-h-50 flex-col items-center justify-center gap-4 bg-[#F5F5F5]">
                  <Package size={36} className="text-gray-200" />
                  <p className="text-sm text-gray-400">No orders yet.</p>
                  <Link to="/products">
                    <Button variant="black">Start Shopping</Button>
                  </Link>
                </div>
              )}

              {/* Orders list */}
              {!ordersLoading && orders.length > 0 && (
                <div className="flex flex-col gap-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-100 p-4">
                      {/* Order header */}
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">Order ID</p>
                          <p className="text-sm font-medium text-black">
                            #{order._id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <span
                            className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="flex flex-col gap-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="h-14 w-12 shrink-0 overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="line-clamp-1 text-xs font-medium text-black">
                                {item.title}
                              </p>
                              {item.size && (
                                <p className="text-xs text-gray-400">
                                  Size: {item.size} · Qty: {item.qty}
                                </p>
                              )}
                            </div>
                            <p className="text-xs font-bold text-black">
                              $ {(item.price * item.qty).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order footer */}
                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                        <p className="text-xs text-gray-400">
                          {order.items.length} item
                          {order.items.length > 1 ? "s" : ""}
                        </p>
                        <p className="text-sm font-bold text-black">
                          ${" "}
                          {(
                            order.totalPrice + order.shippingPrice
                          ).toLocaleString()}
                        </p>
                      </div>

                      {/* in your orders map — after order footer */}
                      <div className="mt-3 flex items-center justify-between">
                        {/* Return button — only for delivered orders */}
                        {order.status === "delivered" &&
                          !getOrderReturn(order._id) && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setReturnModal(true);
                              }}
                              className="text-xs text-gray-400 underline underline-offset-4 hover:text-black"
                            >
                              Request Return
                            </button>
                          )}

                        {/* Return status — if return already requested */}
                        {getOrderReturn(order._id) && (
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-400">Return:</p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                getOrderReturn(order._id).status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : getOrderReturn(order._id).status ===
                                      "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : getOrderReturn(order._id).status ===
                                        "approved"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {getOrderReturn(order._id).status}
                            </span>
                            {/* refund status */}
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                getOrderReturn(order._id).refundStatus ===
                                "processed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              Refund: {getOrderReturn(order._id).refundStatus}
                            </span>
                          </div>
                        )}

                        {/* Payment status */}
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "refunded"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          Payment: {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {returnModal && selectedOrder && (
        <ReturnModal
          order={selectedOrder}
          onClose={() => {
            setReturnModal(false);
            setSelectedOrder(null);
          }}
          onSuccess={async () => {
            // refresh returns
            const { data } = await axiosInstance.get("/returns/mine", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setReturns(data);
          }}
        />
      )}
    </section>
  );
};

export default Account;
