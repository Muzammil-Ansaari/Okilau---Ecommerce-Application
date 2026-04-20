import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const PaymentForm = ({ loading, setLoading, orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    // ✅ SUCCESS
    if (paymentIntent?.status === "succeeded") {
      // ❗ DO NOT call backend
      // webhook will handle everything
      clearCart();
      navigate(`/order-processing?orderId=${orderId}`);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <PaymentElement />

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* hidden submit button triggered from checkout */}
      <button id="stripe-submit" onClick={handleSubmit} className="hidden" />
    </div>
  );
};

export default PaymentForm;
