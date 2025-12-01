import { Link } from "react-router-dom";

function PaymentCancel() {
  return (
    <div className="h-[70vh] flex flex-col justify-center items-center dark:bg-gray-900">
      <div className="w-24 h-24 mb-6 flex items-center justify-center bg-red-100 rounded-full">
        <svg
          className="w-12 h-12 text-red-600 animate-zoom-in-out"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-red-700 mb-2">
        Payment Cancelled!
      </h2>
      <p className="text-gray-600 mb-6">Your payment was not completed.</p>

      <Link
      style={{ color: "white" }}
        to="/"
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Go to Home
      </Link>
    </div>
  );
}

export default PaymentCancel;
