import React from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useNavigate } from "react-router-dom";

function Google({ className }) {
  const navigate = useNavigate();
  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleAuth}
      className={`flex items-center ${className} justify-center gap-2 bg-white text-white border border-gray-300 px-4 py-2 rounded-lg shadow hover:shadow-md transition duration-200`}
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
        className="w-5 h-5"
      />
      <span className="font-medium">Sign in with Google</span>
    </button>
  );
}

export default Google;
