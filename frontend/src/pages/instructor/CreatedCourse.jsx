import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import FullScreenLoader from "@/components/FullScreenLoader";

function CreatedCourse() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const resetCourses = (id) => {
    const course = courses.filter((course) => course.id !== id);
    console.log("resetCourses", course);
    setCourses(course);
  };

  useEffect(() => {
    setLoading(true);
    console.log(courses.length);
    const fetchCourses = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/instructor/created-course`
      );
      if (response.status === 200) {
        console.log(
          "Created courses fetched successfully:",
          response.data.courses.length
        );
        setCourses(response.data.courses);
        setLoading(false);
      }
    };
    fetchCourses();
    return () => {
      setCourses([]);
    };
  }, []);

  const handlePublish = async (courseId) => {
    setLoading(true);
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/instructor/publish-course/`,
      { courseId }
    );
    if (response.status === 200) {
      resetCourses(courseId);
      setLoading(false);
      toast.success("Course published successfully!");
    }
  };

  if (isLoading) {
    return <FullScreenLoader />;
  } else {
    return (
      <div className="p-6 pt-10 ">
        <Toaster position="top-center" />
        <h2 className="text-xl font-semibold mb-4">Created Courses</h2>
        {courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div
                  key={course?._id}
                  className="border rounded-md overflow-hidden"
                >
                  <img
                    src={course?.thumbnail}
                    alt={course?.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{course?.title}</h3>
                    <p className="text-gray-600">{course?.description}</p>
                  </div>
                  <div className="p-4 dark:bg-gray-800 flex justify-between items-center">
                    <button
                      onClick={() => handlePublish(course?.id)}
                      style={{ backgroundColor: "#646eff" }}
                      className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 w-full"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-gray-600 text-center mt-5">
              No courses created yet.
            </div>
          </>
        )}
      </div>
    );
  }
}

export default CreatedCourse;
