import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axios";

const STATUS_OPTIONS = ["pending", "approved", "rejected", "completed"];
const REFUND_OPTIONS = ["pending", "processed", "rejected"];

const AdminReturns = () => {
  const { token } = useAuth();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReturn, setExpandedReturn] = useState(null);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/returns", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReturns(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleUpdate = async (id, updates) => {
    try {
      await axiosInstance.put(`/returns/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReturns();
    } catch (error) {
      console.log(error);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "approved":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-['Anton'] text-3xl uppercase tracking-widest text-black">
        Returns
        <span className="ml-2 text-lg text-gray-400">({returns.length})</span>
      </h1>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm uppercase tracking-widest text-gray-400">
            Loading...
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4">Return ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Refund</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Refund Status</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((ret) => (
                <React.Fragment key={ret._id}>
                  <tr className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-black">
                      #{ret._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-black">{ret.user?.name}</p>
                      <p className="text-xs text-gray-400">{ret.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <p className="line-clamp-1">{ret.reason}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-black">
                      $ {ret.refundAmount.toLocaleString()}
                    </td>

                    {/* Status dropdown */}
                    <td className="px-6 py-4">
                      <select
                        value={ret.status}
                        onChange={(e) =>
                          handleUpdate(ret._id, { status: e.target.value })
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium outline-none cursor-pointer ${statusColor(ret.status)}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Refund status dropdown */}
                    <td className="px-6 py-4">
                      <select
                        value={ret.refundStatus}
                        onChange={(e) =>
                          handleUpdate(ret._id, {
                            status: ret.status,
                            refundStatus: e.target.value,
                          })
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium outline-none cursor-pointer ${
                          ret.refundStatus === "processed"
                            ? "bg-green-100 text-green-700"
                            : ret.refundStatus === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {REFUND_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          setExpandedReturn(
                            expandedReturn === ret._id ? null : ret._id,
                          )
                        }
                        className="text-xs text-gray-400 underline underline-offset-4 hover:text-black"
                      >
                        {expandedReturn === ret._id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded details */}
                  {expandedReturn === ret._id && (
                    <tr key={`${ret._id}-expanded`} className="bg-[#F5F5F5]">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="flex flex-col gap-3">
                          <div className="mb-3">
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                              Related Order
                            </p>
                            <p className="text-sm font-medium text-black mt-1">
                              #{ret.order?._id}
                            </p>
                            <p className="text-xs text-gray-400">
                              Total: ${" "}
                              {ret.order?.totalPrice?.toLocaleString()}
                            </p>
                          </div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                            Items
                          </p>
                          {ret.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-12 w-10 object-cover"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {item.title}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Qty: {item.qty}
                                </p>
                              </div>
                              <p className="text-sm font-bold">
                                $ {(item.price * item.qty).toLocaleString()}
                              </p>
                            </div>
                          ))}
                          {ret.description && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                Description
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {ret.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {returns.length === 0 && (
            <div className="flex min-h-[20vh] items-center justify-center">
              <p className="text-sm text-gray-400">No return requests found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReturns;
