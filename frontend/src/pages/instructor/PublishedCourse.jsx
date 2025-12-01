import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import PublishedCourseCard from "@/components/PublishedCourseCard";
import FullScreenLoader from "@/components/FullScreenLoader";

const PublishedCourse = () => {
  const [publishedCourse, setPublishedCourse] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    console.log("Fetching published courses...");
    const fetchCourses = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/instructor/get-published-course`
      );
      if (response.status === 200) {
        console.log(
          "Published courses fetched successfully:",
          response.data.courses
        );
        setPublishedCourse(response.data.courses);
        setLoading(false);
      }
    };
    fetchCourses();
    return () => {
      setPublishedCourse([]);
    };
  }, []);

  if (isLoading) {
    return <FullScreenLoader />;
  } else {
    return (
      <div className="p-6  pt-10">
        <h2 className="text-2xl font-bold mb-4">Published Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {publishedCourse.length > 0 ? (
            <>
              {publishedCourse.map((course, index) => (
                <PublishedCourseCard key={index} course={course} />
              ))}
            </>
          ) : (
            <>
              <div className="text-gray-600 text-center mt-5">
                No published courses found.
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
};

export default PublishedCourse;
