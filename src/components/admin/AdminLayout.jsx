import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { label: "Returns", path: "/admin/returns", icon: RotateCcw },
  { label: "Users", path: "/admin/users", icon: Users },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {/* ── Sidebar ── */}
      <aside
        className={`flex flex-col bg-black text-white transition-all duration-300 ${sidebarOpen ? "w-56" : "w-16"}`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          {sidebarOpen && (
            <span className="font-['Anton'] text-lg uppercase tracking-widest">
              Okilau
            </span>
          )}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="text-white/60 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded ${
                  isActive
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`
              }
            >
              <link.icon size={18} className="shrink-0" />
              {sidebarOpen && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-white/10 p-3">
          {sidebarOpen && (
            <div className="mb-3 px-3">
              <p className="text-xs font-medium text-white">{user?.name}</p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        {/* <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Admin</span>
            <ChevronRight size={12} />
            <span className="text-black capitalize">Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header> */}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* 👈 admin pages render here */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
