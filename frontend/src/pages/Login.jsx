import Google from "@/components/Google";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { login, setUserRole } from "@/reduxStore/userSlice";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SpadeIcon } from "lucide-react";
import Alert from "@/components/Alert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      toast.message("All fields required");
    } else if (password.length < 6) {
      toast.warning("Password length min 6");
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/login`,
          {
            email,
            password,
            userRole: role,
          }
        );
        if (response.status === 200) {
          console.log(response.data.user);
          dispatch(login(response.data.user));
          dispatch(setUserRole(response.data.user.user_role));
          toast.success("Login successful");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          toast.error("Login failed");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Login error");
      }
    }
  };

  const handleResetPassword = () => {
    setAlert((prev) => !prev);
  };

  return (
    <>
      {alert ? (
        <Alert open={alert} email={email} userRole={role} setOpen={setAlert} />
      ) : (
        <></>
      )}
      <div className="md:flex flex justify-center">
        <Toaster position="top-center" />
        <div className="px-8 md:px-0">
          <div className="py-8 px-0 w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-300">
              Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email and Role in same row */}
              <div>
                <label
                  className="block text-gray-600 font-medium mb-1"
                  htmlFor="email"
                >
                  Email & Role
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <select
                    id="role"
                    className="w-[40%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option className="bg-gray-700 " value="student">
                      Student
                    </option>
                    <option className="bg-gray-700 " value="instructor">
                      Instructor
                    </option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-gray-600 font-medium"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Remember Me & Forgot */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input type="checkbox" id="rememberMe" className="mr-2" />
                  <label htmlFor="rememberMe" className="text-gray-600">
                    Remember me
                  </label>
                </div>
                <span
                  onClick={handleResetPassword}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Forgot password?
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
            </form>

            <p className="my-2 text-center">Or</p>

            {/* Google Auth */}
            <div className="flex justify-center">
              <Google className={"w-full"} />
            </div>

            {/* Signup Link */}
            <p className="mt-4 text-center">
              Don't have account? <Link to={"/signup"}>Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
