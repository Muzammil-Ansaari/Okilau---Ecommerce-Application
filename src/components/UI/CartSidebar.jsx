import { Link, useNavigate } from "react-router-dom";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Button from "./Button";
import { useCart } from "../../context/CartContext";

const CartSidebar = () => {
  const {
    cartItems,
    removeFromCart,
    updateQty,
    cartTotal,
    cartCount,
    isSidebarOpen,
    closeSidebar,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    closeSidebar();
    navigate("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 sm:w-100 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h2 className="font-['Anton'] text-lg uppercase tracking-widest">
              Your Cart
            </h2>
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={closeSidebar}
            className="p-1 text-gray-500 transition-colors hover:text-black"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          // Empty State
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
            <ShoppingBag size={48} className="text-gray-200" />
            <p className="text-sm text-gray-400">Your cart is empty</p>
            <Button variant="black" onClick={closeSidebar}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Items List — max 4 visible, rest scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="flex flex-col gap-6">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${index}`} className="flex gap-4">

                    {/* Product Image */}
                    <Link
                      to={`/products/${item.id}`}
                      onClick={closeSidebar}
                      className="h-24 w-20 shrink-0 overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          to={`/products/${item.id}`}
                          onClick={closeSidebar}
                          className="text-sm font-medium text-black hover:underline"
                        >
                          {item.title}
                        </Link>
                        {item.size && (
                          <p className="mt-0.5 text-xs text-gray-400">
                            Size: {item.size}
                          </p>
                        )}
                        {item.color && (
                          <p className="mt-0.5 text-xs text-gray-400">
                            Color: {item.color}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Qty Controls */}
                        <div className="flex items-center border border-gray-200">
                          <button
                            onClick={() => updateQty(item.id, item.size, item.qty - 1)}
                            className="flex h-7 w-7 items-center justify-center text-gray-500 transition-colors hover:bg-black hover:text-white"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.size, item.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center text-gray-500 transition-colors hover:bg-black hover:text-white"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-bold text-black">
                          Rs. {(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="self-start text-gray-300 transition-colors hover:text-black"
                    >
                      <X size={16} />
                    </button>

                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-6">

              {/* Subtotal */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="text-base font-bold text-black">
                  Rs. {cartTotal.toLocaleString()}
                </p>
              </div>

              <p className="mb-4 text-center text-xs text-gray-400">
                Shipping & taxes calculated at checkout
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <Button variant="black" className="w-full" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
                <Link to="/cart" onClick={closeSidebar}>
                  <Button variant="gray" className="w-full">
                    View Cart
                  </Button>
                </Link>
              </div>

            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartSidebar;