import { ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const companyLinks = [
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Shipping & Return", path: "/#" },
  { label: "FAQ", path: "/#" },
];

const informationLinks = [
  { label: "My Account", path: "/account" },
  { label: "My Cart", path: "/cart" },
  { label: "Wishlist", path: "/wishlist" },
  { label: "Checkout", path: "/checkout" },
];

const contactLinks = [
  { label: "Customer Service", path: "/#" },
  { label: "Store Locator", path: "/#" },
  { label: "Wholesale", path: "/#" },
  { label: "Career", path: "/#" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

const Footer = () => {
  return (
    <footer className="bg-[#F5F5F5] mt-10">
      {/* Main Footer */}
      <div className="px-4 pb-8 md:px-8 lg:px-24">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-center sm:text-left">
          {/* Subscribe Column */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 font-['Anton'] text-4xl uppercase tracking-wide text-black">
              Subscribe
            </h3>
            <p className="mb-6 text-base text-gray-500">
              Our conversation is just getting started
            </p>

            {/* Email Input */}
            <div className="flex justify-center sm:justify-normal">
              <input
                type="email"
                placeholder="Your Email"
                className="w-[75%] border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black transition-colors"
              />
              <button className="bg-black px-4 py-3 text-white transition-colors hover:bg-gray-800 cursor-pointer">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Company Links */}
          <div className="">
            <h4 className="mb-6 text-base font-bold uppercase tracking-wide text-black">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-base text-gray-500 transition-colors hover:text-black"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information Links */}
          <div>
            <h4 className="mb-6 text-base font-bold uppercase tracking-wide text-black">
              Information
            </h4>
            <ul className="flex flex-col gap-3">
              {informationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-base text-gray-500 transition-colors hover:text-black"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Links */}
          <div>
            <h4 className="mb-6 text-base font-bold uppercase tracking-wide text-black">
              Contact
            </h4>
            <ul className="flex flex-col gap-3">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-base text-gray-500 transition-colors hover:text-black"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="mb-6 text-base font-bold uppercase tracking-wide text-black">
              Follow Us
            </h4>
            <ul className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base text-gray-500 transition-colors hover:text-black"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 px-4 py-6 md:px-8 lg:px-24">
        {/* Copyright */}
        <p className="text-xs text-gray-400">
          © 2026, Okilau. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
