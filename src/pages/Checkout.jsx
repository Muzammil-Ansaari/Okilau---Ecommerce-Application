import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Button from "../components/UI/Button";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal > 5000 ? 0 : 299;
  const total = cartTotal + shipping;

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Pakistan",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.phone) newErrors.phone = "Phone is required";
    if (!form.address) newErrors.address = "Address is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.zip) newErrors.zip = "ZIP code is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // mock order placement delay
    setTimeout(() => {
      clearCart();
      navigate("/order-success");
    }, 1500);
  };

  // input field component to avoid repetition
  const InputField = ({ label, name, type = "text", placeholder, half }) => (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-gray-500">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full border px-4 py-3 text-sm outline-none transition-colors focus:border-black ${
          errors[name] ? "border-red-400" : "border-gray-200"
        }`}
      />
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <section className="min-h-screen px-4 py-12 sm:px-8 lg:px-16">

      {/* Heading */}
      <h1 className="mb-10 font-['Anton'] text-3xl uppercase tracking-widest text-black sm:text-4xl">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

          {/* ── Left — Form ── */}
          <div className="flex flex-col gap-8 lg:col-span-2">

            {/* Personal Info */}
            <div>
              <h2 className="mb-4 font-['Anton'] text-lg uppercase tracking-widest text-black">
                Personal Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Full Name" name="name" placeholder="John Doe" />
                <InputField label="Email" name="email" type="email" placeholder="you@example.com" />
                <InputField label="Phone" name="phone" type="tel" placeholder="+92 300 0000000" />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Shipping Address */}
            <div>
              <h2 className="mb-4 font-['Anton'] text-lg uppercase tracking-widest text-black">
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Street Address" name="address" placeholder="123 Main Street" />
                <InputField label="City" name="city" placeholder="Lahore" half />
                <InputField label="State / Province" name="state" placeholder="Punjab" half />
                <InputField label="ZIP / Postal Code" name="zip" placeholder="54000" half />
                <InputField label="Country" name="country" placeholder="Pakistan" half />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Payment — mock */}
            <div>
              <h2 className="mb-4 font-['Anton'] text-lg uppercase tracking-widest text-black">
                Payment Method
              </h2>
              <div className="flex flex-col gap-3">

                {/* Cash on delivery — selected by default */}
                <label className="flex cursor-pointer items-center gap-3 border border-black p-4">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="accent-black"
                  />
                  <div>
                    <p className="text-sm font-medium text-black">Cash on Delivery</p>
                    <p className="text-xs text-gray-400">Pay when your order arrives</p>
                  </div>
                </label>

                {/* Card — disabled for now */}
                <label className="flex cursor-not-allowed items-center gap-3 border border-gray-100 p-4 opacity-40">
                  <input
                    type="radio"
                    name="payment"
                    disabled
                    className="accent-black"
                  />
                  <div>
                    <p className="text-sm font-medium text-black">Credit / Debit Card</p>
                    <p className="text-xs text-gray-400">Coming soon</p>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* ── Right — Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#F5F5F5] p-6">
              <h2 className="mb-6 font-['Anton'] text-lg uppercase tracking-widest text-black">
                Order Summary
              </h2>

              {/* Items */}
              <div className="mb-4 flex flex-col gap-4">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.id}-${item.size}-${index}`}
                    className="flex items-center gap-3"
                  >
                    <div className="relative h-16 w-14 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                      {/* qty badge */}
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-black line-clamp-1">
                        {item.title}
                      </p>
                      {item.size && (
                        <p className="text-xs text-gray-400">Size: {item.size}</p>
                      )}
                    </div>
                    <p className="text-xs font-bold text-black">
                      Rs. {(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200" />

              {/* Totals */}
              <div className="my-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="text-sm font-medium">Rs. {cartTotal.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Shipping</p>
                  <p className="text-sm font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-500">Free</span>
                    ) : (
                      `Rs. ${shipping}`
                    )}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-black">Total</p>
                    <p className="font-bold text-black">
                      Rs. {total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                type="submit"
                variant="black"
                className="w-full"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </Button>

              <p className="mt-4 text-center text-xs text-gray-400">
                By placing your order you agree to our terms & conditions
              </p>
            </div>
          </div>

        </div>
      </form>
    </section>
  );
};

export default Checkout;