import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setDraftCourses } from "../../reduxStore/courseSlice";
import { useEffect } from "react";
import FullScreenLoader from "@/components/FullScreenLoader";
import axios from "axios";
axios.defaults.withCredentials = true;

function DraftCourse() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [remount, setRemount] = useState(false);
  const draftCourses = useSelector((state) => state.course?.draftCourses) || [];

  const handleEdit = (courseId) => {
    console.log("Edit course:", courseId);
    navigate(`/edit-course/${courseId}`);
  };

  const handleDelete = async (courseId) => {
    console.log("Edit course:", courseId);
    setLoading(true);
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/instructor/delete-course`,
      {
        courseId: courseId,
      }
    );
    if (response.status == 200) {
      console.log(response);
      setLoading(false);
      setRemount((prev) => !prev);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("draft:", draftCourses);
    setLoading(true);
    const fetchDraftCourses = async () => {
      try {
        await axios
          .get(
            `${import.meta.env.VITE_API_URL}/api/instructor/get-drafted-course`
          )
          .then((response) => {
            dispatch(setDraftCourses(response.data.courses));
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error("Error fetching draft courses:", error);
      }
    };
    fetchDraftCourses();
  }, [remount]);

  if (isLoading) {
    return <FullScreenLoader />;
  } else {
    return (
      <div className="p-6 pt-10">
        <h2 className="text-2xl font-bold mb-4">Your Draft Courses</h2>
        {draftCourses.length === 0 && (
          <div className="text-gray-600 text-center mt-5">
            No draft courses found. Start creating your first course!
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {draftCourses.map((course) => (
            <div
              key={course.id}
              className="dark:bg-gray-800 shadow-md rounded-2xl p-4 flex flex-col justify-between"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-35 object-cover rounded-md mb-3"
              />
              <div>
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-gray-300 text-sm mt-1">
                  {course.description?.slice(0,100) + ".."}
                </p>
              </div>
              <button
                onClick={() => handleEdit(course.id)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
              >
                Edit
              </button>
              <div className="flex justify-end">
                <button
                  style={{
                    backgroundColor: "#990000",
                    color: "white",
                    width: "fit-content",
                    padding: "4px 10px",
                  }}
                  onClick={() => handleDelete(course.id)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default DraftCourse;
