import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setLocalStorage } from "@/reduxStore/cartSlice";

function PaymentSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.user);
  const [time, setTime] = useState(5);
  dispatch(setLocalStorage({ userId: userId?.id }));
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev == 0) {
          return prev;
        } else {
          return prev - 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (time === 0) {
      navigate("/student-dashboard");
    }
  }, [time]);

  return (
    <div className="h-[70vh] flex flex-col justify-center items-center bg-green-50">
      <div className="w-24 h-24 mb-6 flex items-center justify-center animate-zoom-in-out bg-green-100 rounded-full">
        <svg
          className="w-12 h-12 text-green-600 animate-zoom-in-out"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-green-700 mb-2">
        Payment Successful!
      </h2>
      <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
      <p className="text-black text-sm mb-4">Redirecting in {time}sec</p>
      <Link
        to="/"
        style={{ color: "white" }}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Go to Home
      </Link>
    </div>
  );
}

export default PaymentSuccess;
