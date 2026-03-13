import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import Button from "../components/UI/Button";

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } =
    useCart();
  const navigate = useNavigate();

  const shipping = cartTotal > 5000 ? 0 : 299;
  const total = cartTotal + shipping;

  // ── Empty Cart State ──
  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
        <ShoppingBag size={64} className="text-gray-200" />
        <h2 className="font-['Anton'] text-2xl uppercase tracking-widest text-black">
          Your Cart is Empty
        </h2>
        <p className="text-sm text-gray-400">
          Looks like you haven't added anything yet.
        </p>
        <Link to="/products">
          <Button variant="black">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen px-4 py-12 sm:px-8 lg:px-16">

      {/* Heading */}
      <h1 className="mb-10 font-['Anton'] text-3xl uppercase tracking-widest text-black sm:text-4xl">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

        {/* ── Left — Cart Items ── */}
        <div className="lg:col-span-2">

          {/* Table Header — desktop only */}
          <div className="mb-4 hidden grid-cols-12 border-b border-gray-200 pb-3 text-xs font-medium uppercase tracking-widest text-gray-400 sm:grid">
            <span className="col-span-6">Product</span>
            <span className="col-span-2 text-center">Price</span>
            <span className="col-span-2 text-center">Quantity</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          {/* Cart Items */}
          <div className="flex flex-col divide-y divide-gray-100">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${index}`}
                className="grid grid-cols-12 items-center gap-4 py-6"
              >
                {/* Image + Info */}
                <div className="col-span-10 flex gap-4 sm:col-span-6">
                  <Link
                    to={`/products/${item.id}`}
                    className="h-28 w-24 shrink-0 overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </Link>
                  <div className="flex flex-col justify-center gap-1">
                    <Link
                      to={`/products/${item.id}`}
                      className="text-sm font-semibold text-black hover:underline"
                    >
                      {item.title}
                    </Link>
                    {item.size && (
                      <p className="text-xs text-gray-400">Size: {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-xs text-gray-400">Color: {item.color}</p>
                    )}
                    {/* Mobile price */}
                    <p className="mt-1 text-sm font-bold text-black sm:hidden">
                      Rs. {item.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Remove — mobile */}
                <div className="col-span-2 flex justify-end sm:hidden">
                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-gray-300 transition-colors hover:text-black"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Price — desktop */}
                <div className="col-span-2 hidden text-center text-sm font-medium text-black sm:block">
                  Rs. {item.price.toLocaleString()}
                </div>

                {/* Qty Controls */}
                <div className="col-span-10 sm:col-span-2">
                  <div className="flex w-fit items-center border border-gray-200">
                    <button
                      onClick={() => updateQty(item.id, item.size, item.qty - 1)}
                      className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-black hover:text-white"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.size, item.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-black hover:text-white"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Item Total + Remove — desktop */}
                <div className="col-span-2 hidden items-center justify-end gap-4 sm:flex">
                  <p className="text-sm font-bold text-black">
                    Rs. {(item.price * item.qty).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-gray-300 transition-colors hover:text-black"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom actions */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
            <Link to="/products">
              <Button variant="gray">Continue Shopping</Button>
            </Link>
            <button
              onClick={clearCart}
              className="text-sm text-gray-400 underline underline-offset-4 transition-colors hover:text-black"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* ── Right — Order Summary ── */}
        <div className="lg:col-span-1">
          <div className="bg-[#F5F5F5] p-6">
            <h2 className="mb-6 font-['Anton'] text-xl uppercase tracking-widest text-black">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Subtotal ({cartItems.length} items)
                </p>
                <p className="text-sm font-medium text-black">
                  Rs. {cartTotal.toLocaleString()}
                </p>
              </div>

              {/* Shipping */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Shipping</p>
                <p className="text-sm font-medium text-black">
                  {shipping === 0 ? (
                    <span className="text-green-500">Free</span>
                  ) : (
                    `Rs. ${shipping}`
                  )}
                </p>
              </div>

              {/* Free shipping notice */}
              {shipping > 0 && (
                <p className="text-xs text-gray-400">
                  Add Rs. {(5000 - cartTotal).toLocaleString()} more for free
                  shipping!
                </p>
              )}

              {/* Divider */}
              <div className="my-2 border-t border-gray-200" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-black">Total</p>
                <p className="text-base font-bold text-black">
                  Rs. {total.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="mt-6">
              <Button
                variant="black"
                className="w-full"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              Taxes calculated at checkout
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Cart;