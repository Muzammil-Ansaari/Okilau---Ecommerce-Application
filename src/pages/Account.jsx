import { Link, useNavigate } from "react-router-dom";
import { User, Heart, LogOut, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import Button from "../components/UI/Button";

const Account = () => {
  const { user, logout } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="min-h-screen px-4 py-12 sm:px-8 lg:px-16">

      {/* Heading */}
      <h1 className="mb-10 font-['Anton'] text-3xl uppercase tracking-widest text-black sm:text-4xl">
        My Account
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* ── Left — User Info + Logout ── */}
        <div className="lg:col-span-1">

          {/* User Card */}
          <div className="bg-[#F5F5F5] p-6">

            {/* Avatar */}
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
              <span className="font-['Anton'] text-2xl uppercase">
                {user?.name?.charAt(0)}
              </span>
            </div>

            {/* Info */}
            <h2 className="font-['Anton'] text-xl uppercase tracking-widest text-black">
              {user?.name}
            </h2>
            <p className="mt-1 text-sm text-gray-400">{user?.email}</p>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200" />

            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-1">
                <Heart size={18} className="text-gray-400" />
                <p className="text-lg font-bold text-black">
                  {wishlistItems.length}
                </p>
                <p className="text-xs text-gray-400">Wishlist</p>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div className="flex flex-col items-center gap-1">
                <ShoppingBag size={18} className="text-gray-400" />
                <p className="text-lg font-bold text-black">0</p>
                <p className="text-xs text-gray-400">Orders</p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 text-sm text-gray-400 transition-colors hover:text-black"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* ── Right — Wishlist Summary ── */}
        <div className="lg:col-span-2">
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

          {/* Empty wishlist */}
          {wishlistItems.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 bg-[#F5F5F5]">
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
                <div key={item.id} className="group relative flex flex-col gap-2">

                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <Link to={`/products/${item.id}`}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-48 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    {/* Remove */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md text-gray-400 transition-colors hover:text-black"
                    >
                      ×
                    </button>
                  </div>

                  <Link
                    to={`/products/${item.id}`}
                    className="text-xs font-semibold text-black line-clamp-1 hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-gray-500">
                    Rs. {item.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Show more if more than 6 */}
          {wishlistItems.length > 6 && (
            <div className="mt-6 text-center">
              <Link to="/wishlist">
                <Button variant="gray">
                  View All {wishlistItems.length} Items
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Account;