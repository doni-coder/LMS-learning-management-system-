import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { setTempUser, login } from "../reduxStore/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SelectRole() {
  const [role, setRole] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tempUser = useSelector((state) => state.user.tempUser);

  useEffect(() => {
    const fetchTempUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/common/sendTempUser`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          console.log("Temp user data received:", response.data);
          dispatch(setTempUser(response.data.user));
        }
      } catch (err) {
        console.error("Error fetching temp user:", err);
      }
    };

    fetchTempUser();

    return () => {
      console.log("Cleanup on unmount");
    };
  }, []);

  const handleSubmit = async () => {
    if (role) {
      const updatedUser = { ...tempUser, userRole: role };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/common/save-user`,
        updatedUser
      );

      if (response.status === 200) {
        console.log("User role updated successfully:", response.data);
        dispatch(login(response.data));
        navigate("/");
      }
    } else {
      alert("Please select a role.");
    }
  };

  return (
    <div className="w-full h-[60vh] flex justify-center items-center">
      <div className="flex md:w-full w-[300px] items-center justify-center ">
        <div className="bg-gray-800 p-8 rounded-lg shadow-sm w-full max-w-sm">
          <h2 className="font-bold text-xl text-gray-300 text-center mb-6">
            Select Your Role
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                id="student"
                name="userRole"
                value="student"
                type="radio"
                onChange={() => setRole("student")}
                className="accent-gray-500 w-3 h-3"
              />
              <label htmlFor="student" className="text-lg text-gray-300 cursor-pointer">
                Student
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="instructor"
                name="userRole"
                value="instructor"
                type="radio"
                onChange={() => setRole("instructor")}
                className="accent-gray-500 w-3 h-3"
              />
              <label htmlFor="instructor" className="text-lg text-gray-300 cursor-pointer">
                Instructor
              </label>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectRole;
