import React from "react";
import { IoMdCart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSingleCourseDetail } from "@/reduxStore/courseSlice";

function CourseCard({ course }) {
  console.log("course", course);
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.user.userRole);
  const navigate = useNavigate();
  const handleOnclick = () => {
    dispatch(setSingleCourseDetail(course));
    navigate(`/course-detail`);
  };

  return (
    <div
      onClick={handleOnclick}
      className="w-[100%] overflow-hidden dark:bg-gray-900 rounded-2xl cursor-pointer  border-2 border-gray-500"
    >
      <div>
        <img className="w-full" src={course.thumbnail} alt="" />
      </div>
      <div className="px-3 py-2">
        <h2 className="text-xl font-bold">{course.title.slice(0, 22)} <span className="text-[10px]">. . .</span></h2>
        <p className="py-1 text-[13px] text-gray-400">
          {`${course.description.slice(0, 100)}..`}
        </p>
        <div className="flex pt-2 justify-between">
          <h2 className="text-xl font-bold">${course.price}</h2>
          {userRole === "student" ? (
            <button
              style={{ backgroundColor: "#646cff", padding: "5px 10px" }}
              className="text-white"
            >
              {"Add"} <IoMdCart className="inline-block" />
            </button>
          ) : null}
        </div>
        <div className="py-2 flex gap-1">
          {course.tags[0] ? (
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
              {course.tags[0]}
            </span>
          ) : (
            <></>
          )}
          {course.tags[1] ? (
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
              {course.tags[1]}
            </span>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
