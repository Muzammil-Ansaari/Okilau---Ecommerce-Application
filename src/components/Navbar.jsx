import { useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import {
  ChevronLeft,
  Menu,
  Search,
  ShoppingBag,
  Star,
  User,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./UI/SearchBar";

const NAV_LINKS = [
  { label: "HOME", path: "/" },
  { label: "PRODUCTS", path: "/products" },
  { label: "ABOUT", path: "/about" },
  { label: "CONTACT", path: "/contact" },
];

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { wishlistCount } = useWishlist();
  const { cartCount, openSidebar } = useCart();
  const { isLoggedIn, user, openAuthModal, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div className="relative">
        {/* ── NAVBAR ── */}
        <div className="px-4 md:px-8 lg:px-24 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <img
              className="w-24 sm:w-28"
              src={
                "https://res.cloudinary.com/dm6dltg3s/image/upload/v1775458826/logo_gb8nll.png"
              }
              alt="okilau logo"
            />
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex gap-10">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `relative font-semibold tracking-wide group transition-colors ${
                    isActive ? "text-black" : "text-gray-600 hover:text-black"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-black transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </ul>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSearchOpen(true)}>
              <Search size={20} className="cursor-pointer" />
            </button>

            {isLoggedIn ? (
              <div className="relative">
                {/* User name — click to toggle */}
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="text-sm font-medium tracking-wide"
                >
                  {user.name}
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <>
                    {/* invisible overlay to close on outside click */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />

                    <div className="absolute right-0 top-full mt-3 z-50 min-w-35 bg-black text-white shadow-lg">
                      {/* Triangle */}
                      <div className="absolute -top-1.5 right-3 h-3 w-3 rotate-45 bg-black" />

                      <div className="py-2">
                        <div className="border-b border-white/10 px-4 py-2">
                          <p className="text-xs text-gray-400">Signed in as</p>
                          <p className="truncate text-xs font-medium">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          to="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-white/10"
                        >
                          My Account
                        </Link>

                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-white/10"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={openAuthModal}>
                <User size={20} className="cursor-pointer" />
              </button>
            )}

            {/* Wishlist */}
            <NavLink to="/wishlist" className="relative">
              <Star size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2.5 -top-3 bg-[#DA3F3F] text-white font-medium rounded-full w-4 text-xs text-center leading-4">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </NavLink>

            {/* Cart */}
            <button onClick={openSidebar} className="relative cursor-pointer">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-2.5 -top-3 bg-[#DA3F3F] text-white font-medium rounded-full w-4 text-xs text-center leading-4">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <Menu
              onClick={() => setVisible(true)}
              size={20}
              className="cursor-pointer md:hidden"
            />
          </div>
        </div>
        <SearchBar
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />

        {/* ── OVERLAY ── */}
        {visible && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setVisible(false)}
          />
        )}

        {/* ── SIDEBAR ── */}
        <div
          className={`fixed top-0 right-0 h-full bg-white z-50 transition-all duration-300 overflow-hidden ${
            visible ? "w-72" : "w-0"
          }`}
        >
          <div className="p-6 min-w-[288px]">
            {/* Back button */}
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-1 cursor-pointer mb-8 text-gray-600 hover:text-black transition-colors"
            >
              <ChevronLeft size={20} />
              <p className="font-medium">Back</p>
            </div>

            {/* Sidebar Links */}
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setVisible(false)}
                  className={({ isActive }) =>
                    `block py-2 text-base font-medium tracking-wide transition-colors ${
                      isActive ? "text-black" : "text-gray-500 hover:text-black"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
