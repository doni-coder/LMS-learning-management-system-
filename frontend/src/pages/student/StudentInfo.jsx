import React, { useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useNavigate } from "react-router-dom";

const StudentInfo = () => {
  const [formData, setFormData] = useState({
    phoneNo: "",
    country: "",
    state: "",
    city: "",
    pinCode: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:");
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/student/registerStudentDetails`,
      {
        ...formData,
      }
    );
    if (response.status === 200) {
      console.log("Student details submitted successfully:", formData);
      navigate("/explore");
    }

    alert("Form submitted (check console).");
  };

  return (
    <div className="mt-[70px]">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto dark:bg-gray-800 p-4 pb-10 rounded-xl pt-10 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">
          Register Student Details
        </h2>

        <input
          type="text"
          name="phoneNo"
          placeholder="Phone Number"
          className="w-full border p-2 rounded"
          value={formData.phoneNo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          value={formData.country}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          value={formData.state}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          value={formData.city}
          required
        />
        <input
          type="text"
          name="pinCode"
          placeholder="Pin Code"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          value={formData.pinCode}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default StudentInfo;
