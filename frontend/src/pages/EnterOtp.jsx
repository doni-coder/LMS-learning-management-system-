import axios from "axios";
import React, { useState, useRef } from "react";
axios.defaults.withCredentials = true

function EnterOtp({ length = 4, onComplete }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);
  const parms = new URLSearchParams(location.search);
  const email = parms.get("email");
  const userRole = parms.get("userRole");

  console.log("email:", email);
  console.log("userRole:", userRole);
  const handleChange = (e, index) => {
    const value = e.target.value.slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    if (newOtp.every((val) => val !== "")) {
      onComplete && onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const submitOtp = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/common/validate-otp`,
      {
        email,
        otp,
        userRole,
      }
    );
    if (response.status === 200) {
      window.location.href = `/reset-password/?email=${encodeURIComponent(
        response.data.email
      )}&userRole=${encodeURIComponent(
        response.data.userRole
      )}&otp=${encodeURIComponent(response.data.otp)}`;
    }
  };

  return (
    <div className="h-[400px]">
      <div className="mt-5">
        <h2 className="text-center">Password reset otp</h2>
        <p className="text-center">
          OTP sent ✅ to <span className="text-sm text-green-600">{email}</span>
        </p>
      </div>
      <div className="flex gap-3 justify-center mt-6">
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            value={value}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputsRef.current[index] = el)}
            className="
            w-10 h-10 text-center text-lg font-medium rounded-sm
            bg-white/10 backdrop-blur-sm border border-white/20
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-500
            transition-all duration-200
          "
            maxLength={1}
            placeholder="•"
          />
        ))}
      </div>
      <button onClick={submitOtp}>Submit</button>
    </div>
  );
}

export default EnterOtp;
