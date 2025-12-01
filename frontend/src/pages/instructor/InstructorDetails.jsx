import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useSelector } from "react-redux";
import { updateUser } from "../../reduxStore/userSlice";
import { useDispatch } from "react-redux";

function InstructorDetails() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    about: user?.about,
    experience: user?.experience,
  });
  console.log("doni:", user);

  useEffect(() => {
    if (user?.about) {
      setFormData({
        about: user.about,
        experience: user.experience,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/instructor/instructor-detail`,
      formData
    );
    if (response.status === 200) {
      dispatch(updateUser({ ...user, ...formData }));
      console.log("Instructor details submitted successfully:", formData);
    }

    console.log("Instructor Registration Data:");
    console.log({
      about: formData.about,
      experience: formData.experience,
    });

    alert("Form submitted (check console).");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto pt-10 pb-10 p-4 rounded-xl shadow space-y-4"
    >
      <h2 className="text-xl font-semibold text-center">About Instructor</h2>

      <textarea
        name="about"
        placeholder="Tell us about yourself"
        rows={4}
        className="w-full border p-2 rounded"
        onChange={handleChange}
        value={formData.about}
        required
      />
      <input
        type="number"
        name="experience"
        placeholder="Experience (e.g. 5 years)"
        className="w-full border p-2 rounded"
        onChange={handleChange}
        value={formData.experience}
        required
      />

      <button
        style={{
          background: "linear-gradient(135deg, black, black)",
          boxShadow: "0 0 4px #0c47f7",
        }}
        type="submit"
        className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700"
      >
        Submit
      </button>
    </form>
  );
}

export default InstructorDetails;
