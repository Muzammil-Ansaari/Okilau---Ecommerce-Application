import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Button from "../components/UI/Button";
import axiosInstance from "../utils/axios";

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  half,
  form,
  errors,
  handleChange,
}) => (
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

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
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

  // add useEffect to fetch address
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const { data } = await axiosInstance.get("/users/address", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // pre-fill form if address exists
        if (data?.address) {
          setForm((prev) => ({
            ...prev,
            phone: data.phone || "",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            zip: data.zip || "",
            country: data.country || "Pakistan",
          }));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (token) fetchAddress();
  }, [token]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(
        "/orders",
        {
          items: cartItems.map((item) => ({
            product: item._id,
            title: item.title,
            image: item.image,
            price: item.price,
            size: item.size,
            color: item.color,
            qty: item.qty,
          })),
          shippingAddress: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
          },
          totalPrice: cartTotal,
          shippingPrice: shipping,
          paymentMethod: "cod",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await axiosInstance.put(
        "/users/address",
        {
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      clearCart();
      navigate("/order-success");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen px-4 py-12 sm:px-8 lg:px-16">
      <h1 className="mb-10 font-['Anton'] text-3xl uppercase tracking-widest text-black sm:text-4xl">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="flex flex-col gap-8 lg:col-span-2">
            <div>
              <h2 className="mb-4 font-['Anton'] text-lg uppercase tracking-widest text-black">
                Personal Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                  form={form}
                  errors={errors}
                  handleChange={handleChange}
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  form={form}
                  errors={errors}
                  handleChange={handleChange}
                />
                <InputField
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="+92 300 0000000"
                  form={form}
                  errors={errors}
                  handleChange={handleChange}
                />
              </div>
            </div>

            <div className="border-t border-gray-100" />

            <div>
              <h2 className="mb-4 font-['Anton'] text-lg uppercase tracking-widest text-black">
                Shipping Address
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Street Address"
                  name="address"
                  placeholder="123 Main Street"
                  form={form}
                  errors={errors}
                  handleChange={handleChange}
                />
                <InputField
                  label="City"
                  name="city"
                  placeholder="Lahore"
                  half
                  form={form}
                  errors={errors}
                  handleChange={handleChange}
                />
                <InputField
                  label="State / Province"
                  name="state"
                  placeholder="Punjab"
                  half
                  form={form}
                  errors={errors}
                  handleChange={handleChange}
                />
                <InputField
                  label="ZIP / Postal Code"
                  name="zip"
                  placeholder="54000"
                  half
                  form={form}
                  errors={errors}
                  handleChange={handleChange}
                />
                <InputField
                  label="Country"
                  name="country"
                  placeholder="Pakistan"
                  half
                  form={form}
                  errors={errors}
                  handleChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#F5F5F5] p-6">
              <h2 className="mb-6 font-['Anton'] text-lg uppercase tracking-widest text-black">
                Order Summary
              </h2>

              <div className="my-4 flex flex-col gap-3">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>Rs. {cartTotal.toLocaleString()}</p>
                </div>

                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</p>
                </div>

                <div className="flex justify-between font-bold">
                  <p>Total</p>
                  <p>Rs. {total.toLocaleString()}</p>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Checkout;
