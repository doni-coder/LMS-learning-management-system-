import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useDispatch, useSelector } from "react-redux";
import { setEnrolledCourse } from "@/reduxStore/courseSlice";
import LiveClassCard from "@/components/LiveClassCard";
import { useSocket } from "@/context/SocketProvider";
import FullScreenLoader from "@/components/FullScreenLoader";

function Student() {
  const [activeTab, setActiveTab] = useState("courses");
  const [liveClasses, setLiveClasses] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const socket = useSocket();
  const [courses, setCourses] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (activeTab === "live") {
      setLoading(true);
      const fetchLiveClasses = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/live-stream/get-live-classes`
          );
          if (response.status === 200) {
            console.log("Fetched Live Classes:", response.data.liveClasses);
            setLiveClasses(response.data.liveClasses || []);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching live classes", error);
        }
      };

      fetchLiveClasses();
    }
  }, [activeTab]);

  useEffect(() => {
    setLoading(true);
    const fetchEnrolledCourses = async () => {
      await axios
        .get(`${import.meta.env.VITE_API_URL}/api/course/enrolled-course`)
        .then((response) => {
          setCourses(response.data.courses);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    };
    fetchEnrolledCourses();
  }, []);

  const activities = [
    'Completed "JS Basics Quiz"',
    "Attended React live class",
    "Submitted Assignment 2",
  ];

  if (isLoading) {
    return <FullScreenLoader />;
  } else {
    return (
      <div className="min-h-[90vh] w-full py-0 md:px-8 px-0 text-white">
        <div className="studentInfo h-[80px] flex justify-center w-full bg-gray-900 fixed  mb-6">
          <div className="flex items-center gap-2 justify-center">
            <button
              style={{
                backgroundColor: "#1e2939",
                padding: "7px 15px",
                fontSize: "13px",
              }}
              className={`px-3 py-1 outline rounded ${
                activeTab === "courses"
                  ? "dark:bg-gray-800 text-blue-500"
                  : "bg-blue-700 text-gray-400"
              }`}
              onClick={() => setActiveTab("courses")}
            >
              My Courses
            </button>
            <button
              style={{
                backgroundColor: "#1e2939",
                padding: "7px 15px",
                fontSize: "13px",
              }}
              className={`px-3 py-1 outline rounded ${
                activeTab === "activity"
                  ? "bg-white text-blue-500"
                  : "bg-blue-700 text-gray-400"
              }`}
              onClick={() => setActiveTab("activity")}
            >
              My Activity
            </button>
            <button
              style={{
                backgroundColor: "#1e2939",
                padding: "7px 15px",
                fontSize: "13px",
              }}
              className={`px-3 py-1 outline rounded ${
                activeTab === "live"
                  ? "bg-white text-blue-500"
                  : "bg-blue-700 text-gray-400"
              }`}
              onClick={() => setActiveTab("live")}
            >
              Live Classes
            </button>
          </div>
        </div>

        <div className="studentCourses flex justify-center px-3 pt-[75px] rouded">
          {activeTab === "courses" && (
            <div className="md:w-[50%] w-[100%]">
              <h2 className="text-xl mb-2 text-white font-semibold">
                My Courses
              </h2>
              {courses?.map((course) => (
                <Link
                  to={`/course-content/${course.id}`}
                  onClick={() =>
                    dispatch(setEnrolledCourse(course.enrolled_id))
                  }
                  key={course.id}
                  className="mb-2 p-2 flex gap-2 border-b-1 border-gray-500"
                >
                  <div className="w-[100px]">
                    <img className="w-full" src={course?.thumbnail} alt="" />
                  </div>
                  <div>
                    <h3 className="text-white">{course.title}</h3>
                    <p className="text-gray-500 text-[12px]">
                      Completed: {course.percentage_completed}%
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {activeTab === "activity" && (
            <div>
              <h2 className="text-xl mb-2 text-gray-300 text-center font-semibold">
                Recent Activity
              </h2>
              {/* <ul className="list-disc ml-5">
              {activities.map((act, index) => (
                <li key={index}>{act}</li>
              ))}
            </ul> */}
              <p className="text-gray-500 text-sm text-center">
                Feature is not available <br />
                we are working on it.
              </p>
            </div>
          )}
          {activeTab === "live" && (
            <div>
              <h2 className="text-xl text-center mb-2 text-gray-200 font-semibold">
                Upcoming Live Classes
              </h2>
              <div className="pt-3 pb-7 px-4 w-full">
                {liveClasses.length == 0 ? (
                  <>
                    <div>
                      <p className="text-center text-sm text-gray-300">
                        No live classes Availabe!
                      </p>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {liveClasses?.map((live, index) => (
                  <div key={index} className="mt-3">
                    <LiveClassCard
                      name={live.room}
                      instructor={live.instructorId}
                      courseId={live.courseId}
                      socketId={socket.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Student;
