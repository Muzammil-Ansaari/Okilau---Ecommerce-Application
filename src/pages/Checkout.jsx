import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Button from "../components/UI/Button";
import axiosInstance from "../utils/axios";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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

  const shipping = cartTotal > 1000 ? 0 : 5;
  const total = cartTotal + shipping;

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");

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

  // const handlePaymentMethodChange = async (method) => {
  //   setPaymentMethod(method);
  //   if (method === "card" && !clientSecret) {
  //     try {
  //       const { data } = await axiosInstance.post(
  //         "/payments/create-intent",
  //         { amount: total },
  //         { headers: { Authorization: `Bearer ${token}` } },
  //       );
  //       setClientSecret(data.clientSecret);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  // const placeOrderAfterPayment = async (paymentIntentId = null) => {
  //   await axiosInstance.post(
  //     "/orders",
  //     {
  //       items: cartItems.map((item) => ({
  //         product: item._id || item.id,
  //         title: item.title,
  //         image: item.image,
  //         price: item.price,
  //         size: item.size,
  //         color: item.color,
  //         qty: item.qty,
  //       })),
  //       shippingAddress: {
  //         name: form.name,
  //         email: form.email,
  //         phone: form.phone,
  //         address: form.address,
  //         city: form.city,
  //         state: form.state,
  //         zip: form.zip,
  //         country: form.country,
  //       },
  //       totalPrice: cartTotal,
  //       shippingPrice: shipping,
  //       paymentMethod,
  //       paymentIntentId, // null for COD, actual id for card
  //     },
  //     { headers: { Authorization: `Bearer ${token}` } },
  //   );
  //   clearCart();
  //   navigate("/order-success");
  // };

  // const handleCODSubmit = async (e) => {
  //   e.preventDefault();
  //   const newErrors = validate();
  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     await placeOrderAfterPayment(null);
  //   } catch (error) {
  //     alert(error.response?.data?.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleCardSuccess = async (paymentIntentId) => {
  //   setLoading(true);
  //   try {
  //     await placeOrderAfterPayment(paymentIntentId);
  //   } catch (error) {
  //     alert(error.response?.data?.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePlaceOrder = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const { data } = await axiosInstance.post(
        "/orders",
        {
          items: cartItems.map((item) => ({
            product: item._id || item.id,
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
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // 🟢 COD → done
      if (paymentMethod === "cod") {
        clearCart();
        navigate("/order-success");
        return;
      }

      // 🔵 CARD → get clientSecret
      setClientSecret(data.clientSecret);
      setOrderId(data.order._id);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const newErrors = validate();
  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     await axiosInstance.post(
  //       "/orders",
  //       {
  //         items: cartItems.map((item) => ({
  //           product: item._id,
  //           title: item.title,
  //           image: item.image,
  //           price: item.price,
  //           size: item.size,
  //           color: item.color,
  //           qty: item.qty,
  //         })),
  //         shippingAddress: {
  //           name: form.name,
  //           email: form.email,
  //           phone: form.phone,
  //           address: form.address,
  //           city: form.city,
  //           state: form.state,
  //           zip: form.zip,
  //           country: form.country,
  //         },
  //         totalPrice: cartTotal,
  //         shippingPrice: shipping,
  //         paymentMethod: "cod",
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     await axiosInstance.put(
  //       "/users/address",
  //       {
  //         phone: form.phone,
  //         address: form.address,
  //         city: form.city,
  //         state: form.state,
  //         zip: form.zip,
  //         country: form.country,
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } },
  //     );

  //     clearCart();
  //     navigate("/order-success");
  //   } catch (error) {
  //     console.log(error);
  //     alert(error.response?.data?.message || "Something went wrong.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <section className="min-h-screen px-4 py-12 sm:px-8 lg:px-16">
      <h1 className="mb-10 font-['Anton'] text-3xl uppercase tracking-widest text-black sm:text-4xl">
        Checkout
      </h1>

      <form onSubmit={(e) => e.preventDefault()}>
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

            {/* Payment Method */}
            <div>
              <h2 className="mb-4 font-['Anton'] text-lg uppercase tracking-widest text-black">
                Payment Method
              </h2>
              <div className="flex flex-col gap-3">
                {/* COD */}
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex cursor-pointer items-center gap-3 border p-4 transition-all ${
                    paymentMethod === "cod" ? "border-black" : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-black"
                  />
                  <div>
                    <p className="text-sm font-medium text-black">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-gray-400">
                      Pay when your order arrives
                    </p>
                  </div>
                </label>

                {/* Card */}
                <label
                  onClick={() => setPaymentMethod("card")}
                  className={`flex cursor-pointer items-center gap-3 border p-4 transition-all ${
                    paymentMethod === "card"
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="accent-black"
                  />
                  <div>
                    <p className="text-sm font-medium text-black">
                      Credit / Debit Card
                    </p>
                    <p className="text-xs text-gray-400">
                      Pay securely with Stripe
                    </p>
                  </div>
                </label>

                {/* Stripe form — shows when card selected */}
                {paymentMethod === "card" && clientSecret && (
                  <div className="border border-gray-200 p-4">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <PaymentForm loading={loading} setLoading={setLoading} orderId={orderId} />
                    </Elements>
                  </div>
                )}
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
                  <p>$ {cartTotal.toLocaleString()}</p>
                </div>

                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>{shipping === 0 ? "Free" : `$ ${shipping}`}</p>
                </div>

                <div className="flex justify-between font-bold">
                  <p>Total</p>
                  <p>$ {total.toLocaleString()}</p>
                </div>
              </div>

              {/* Place Order Button — only for COD */}
              {paymentMethod === "cod" && (
                <Button
                  type="button"
                  variant="black"
                  className="w-full"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </Button>
              )}

              {/* Pay Button — for card */}
              {paymentMethod === "card" && !clientSecret && (
                <Button type="button" onClick={handlePlaceOrder}>
                  Continue to Payment
                </Button>
              )}

              {paymentMethod === "card" && clientSecret && (
                <Button
                  type="button"
                  onClick={() =>
                    document.getElementById("stripe-submit").click()
                  }
                >
                  Pay $ {total.toLocaleString()}
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Checkout;
