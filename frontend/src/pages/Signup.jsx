import Google from "@/components/Google";
import React, { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { Link } from "react-router-dom";
import { MdVerifiedUser } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowForward } from "react-icons/io";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import axios from "axios";
axios.defaults.withCredentials = true;

function Signup() {
  const imageInputRef = useRef(null);
  const [conformPassword, setConformPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState();
  const [displayPic, setDisplayPic] = useState("");
  const [formData, setFormData] = useState({
    profilePic: null,
    name: "",
    userRole: "student",
    email: "",
    password: "",
  });

  const handleFormData = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleInputImage = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.files[0],
    }));
    setDisplayPic(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    setIsPasswordMatch(
      conformPassword.length > 0 && formData.password === conformPassword
    );
  }, [conformPassword, formData.password]);

  const ReturnHtmlSpan = () => {
    if (conformPassword === "") {
      return <></>;
    }
    if (isPasswordMatch) {
      return (
        <span className="px-2 text-green-700">
          <MdVerifiedUser className="inline-block text-green-700" /> Matched
        </span>
      );
    } else {
      return (
        <span className="px-2 text-red-700">
          <RxCross2 className="inline-block text-red-700" /> Matched
        </span>
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.profilePic ||
      !formData.email ||
      !formData.name ||
      !formData.userRole ||
      !formData.password
    ) {
      toast.message("All fields are required.");
      return;
    }

    if (formData.password.length < 6) {
      toast.warning("Password length min 6 character");
      return;
    }

    if (!isPasswordMatch) {
      toast.warning("Confirm password not matched");
      return;
    }

    try {
      const realFormData = new FormData();
      realFormData.append("profilePic", formData.profilePic); // This is the file
      realFormData.append("name", formData.name);
      realFormData.append("userRole", formData.userRole);
      realFormData.append("email", formData.email);
      realFormData.append("password", formData.password);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/common/registerUser`,
        realFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Account created successfully");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      toast.error(
        "Registration failed: " + err.response?.data?.message || err.message
      );
    }
  };

  return (
    <div className="flex relative justify-center">
      <Toaster position="top-center" />
      <div className="px-8 relative pt-8 pb-10">
        <span className="absolute left-8">
          Signup <IoIosArrowForward className="inline-block" />
        </span>
        <div>
          <form onSubmit={handleSubmit} className=" space-y-3" action="">
            <div className="flex justify-center">
              <div
                onClick={handleInputImage}
                style={{ backgroundImage: `url(${displayPic})` }}
                className="profile bg-cover bg-center relative w-[80px] cursor-pointer bg-gray-600 hover:bg-gray-500 h-[80px] flex justify-center items-center rounded-full"
              >
                <CiEdit size={30} color="white" />
              </div>
            </div>
            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              name="profilePic"
              ref={imageInputRef}
              onChange={handleFileChange}
              className=" hidden"
            />
            <div className="flex items-center gap-3">
              <div>
                <label
                  className="block text-gray-600 font-medium"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleFormData}
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label
                  className="block text-gray-600 font-medium"
                  htmlFor="userRole"
                >
                  Role
                </label>
                <select
                  className=" w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  name="userRole"
                  id="userRole"
                  onChange={handleFormData}
                >
                  <option className="bg-gray-700 " value="student">student</option>
                  <option className="bg-gray-700" value="instructor">Instructor</option>
                </select>
              </div>
            </div>
            <div>
              <label
                className="block text-gray-600 font-medium"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleFormData}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                className="inline-block text-gray-600 font-medium"
                htmlFor="password"
              >
                Password
              </label>
              <ReturnHtmlSpan />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleFormData}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter your password"
              />
              <input
                type="text"
                id="conformPassword"
                value={conformPassword}
                onChange={(e) => {
                  setConformPassword(e.target.value);
                }}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Conform password"
              />
            </div>
            <p className="mb-2">
              Already have? <Link to={"/login"}>login</Link>
            </p>
            <div>
              <button className="w-full text-white px-4 py-2 rounded-md transition transform active:scale-95 hover:bg-blue-700">
                Create Account
              </button>
            </div>
          </form>
          <p className="py-1 text-center">Or</p>
          <div>
            <Google className={"w-full"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
