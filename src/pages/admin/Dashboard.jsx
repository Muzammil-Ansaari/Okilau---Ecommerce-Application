import { useState, useEffect } from "react";
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axios";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="flex items-center gap-4 bg-white p-6 shadow-sm">
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${color}`}
    >
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-black">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get("/orders/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm uppercase tracking-widest text-gray-400">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Heading */}
      <h1 className="font-['Anton'] text-3xl uppercase tracking-widest text-black">
        Dashboard
      </h1>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingBag}
          color="bg-black"
        />
        <StatCard
          title="Total Revenue"
          value={`Rs. ${stats?.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={Package}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-white p-6 shadow-sm">
        <h2 className="mb-6 font-['Anton'] text-lg uppercase tracking-widest text-black">
          Recent Orders
        </h2>

        {stats?.recentOrders?.length === 0 ? (
          <p className="text-sm text-gray-400">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-widest text-gray-400">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Items</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-medium text-black">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {order.user?.name || "N/A"}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </td>
                    <td className="py-3 pr-4 font-medium text-black">
                      Rs. {order.totalPrice.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
