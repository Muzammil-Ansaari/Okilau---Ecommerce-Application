import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const OrderProcessing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const orderId = searchParams.get("orderId");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const checkOrder = async () => {
      try {
        const { data } = await axiosInstance.get(`/orders/id/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.paymentStatus === "paid") {
          navigate("/order-success");
        } else if (data.paymentStatus === "failed") {
          setStatus("failed");
        } else {
          // keep checking
          setTimeout(checkOrder, 2000);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkOrder();
  }, [orderId]);

  return (
    <div className="p-10 text-center">
      {status === "loading" && <h2>Processing your payment...</h2>}
      {status === "failed" && <h2>Payment failed. Try again.</h2>}
    </div>
  );
};

export default OrderProcessing;
