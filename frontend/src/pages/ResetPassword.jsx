import React, { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import axios from "axios";
axios.defaults.withCredentials = true;

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const parms = new URLSearchParams(location.search);
  const email = parms.get("email");
  const otp = parms.get("otp");
  const userRole = parms.get("userRole");

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match!");
      return;
    }
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/common/set-new-password`,
      {
        email,
        otp,
        userRole,
        newpassword: confirmPassword,
      }
    );
    if (response.status === 200) {
      toast("Password reset successfully!");
      return;
    }
    toast("something went wrong");
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-[600px] flex items-center justify-center bg-gray-850">
        <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Reset Password
          </h2>
          <form onSubmit={handleReset} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-200"
            >
              Reset
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
