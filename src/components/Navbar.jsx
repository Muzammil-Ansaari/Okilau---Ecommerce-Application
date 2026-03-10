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

const NAV_LINKS = [
  { label: "HOME", path: "/" },
  { label: "PRODUCTS", path: "/products" },
  { label: "ABOUT", path: "/about" },
  { label: "CONTACT", path: "/contact" },
];

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* ── NAVBAR ── */}
      <div className="px-4 md:px-8 lg:px-24 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img className="w-24 sm:w-28" src={assets.logo} alt="okilau logo" />
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
          <Search size={20} className="cursor-pointer" />
          <User size={20} className="cursor-pointer" />

          {/* Wishlist */}
          <NavLink to="/wishlist" className="relative">
            <Star size={20} />
            <span className="absolute -right-2.5 -top-3 bg-[#DA3F3F] text-white font-medium rounded-full w-4 text-xs text-center leading-4">
              8
            </span>
          </NavLink>

          {/* Cart */}
          <NavLink to="/cart" className="relative">
            <ShoppingBag size={20} />
            <span className="absolute -right-2.5 -top-3 bg-[#DA3F3F] text-white font-medium rounded-full w-4 text-xs text-center leading-4">
              8
            </span>
          </NavLink>

          {/* Hamburger — mobile only */}
          <Menu
            onClick={() => setVisible(true)}
            size={20}
            className="cursor-pointer md:hidden"
          />
        </div>
      </div>

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
    </>
  );
};

export default Navbar;
