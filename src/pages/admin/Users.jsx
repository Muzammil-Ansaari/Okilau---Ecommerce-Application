import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axios";

const AdminUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-['Anton'] text-3xl uppercase tracking-widest text-black">
          Users
          <span className="ml-2 text-lg text-gray-400">({users.length})</span>
        </h1>
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
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50">

                  {/* Avatar + Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white text-xs font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-medium text-black">{user.name}</p>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      user.role === "admin"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="flex min-h-[20vh] items-center justify-center">
              <p className="text-sm text-gray-400">No users found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;