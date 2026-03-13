import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Button from "../components/UI/Button";

const OrderSuccess = () => {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">

      {/* Icon */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#F5F5F5]">
        <CheckCircle size={48} className="text-black" />
      </div>

      {/* Heading */}
      <h1 className="font-['Anton'] text-3xl uppercase tracking-widest text-black sm:text-4xl">
        Order Placed!
      </h1>

      {/* Subtext */}
      <p className="mt-4 max-w-md text-sm text-gray-400">
        Thank you for shopping with Okilau. Your order has been received and is
        currently being processed. You will receive a confirmation shortly.
      </p>

      {/* Divider */}
      <div className="my-8 w-24 border-t border-gray-200" />

      {/* What's next */}
      <div className="mb-8 flex flex-col gap-2 text-sm text-gray-500">
        <p>📦 Your order is being prepared</p>
        <p>🚚 Estimated delivery: 3-5 business days</p>
        <p>📧 Confirmation will be sent to your email</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row mb-10">
        <Link to="/products">
          <Button variant="black">Continue Shopping</Button>
        </Link>
        <Link to="/account">
          <Button variant="gray">View My Orders</Button>
        </Link>
      </div>

    </section>
  );
};

export default OrderSuccess;