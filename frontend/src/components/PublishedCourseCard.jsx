import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSocket } from "@/context/SocketProvider";

function PublishedCourseCard({ course, courseId }) {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.user.id);
  const socket = useSocket();

  const handleLiveSession = () => {
    socket.emit("create:room", {
      instructorId: userId,
      courseId: course.id,
      key: "1234",
      room: course.title,
    });
  };

  socket.on("room:created", (data) => {
    navigate(`/start-live/${course.id}`);
  });

  return (
    <div
      key={course.id}
      className="dark:bg-gray-800 shadow-md rounded-2xl p-4 flex flex-col justify-between"
    >
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-36 object-cover rounded-md mb-3"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-gray-400 text-sm mt-1">
          {course.description?.slice(0, 100)}...
        </p>
        <div className="mt-3">
          <p className="text-blue-600 font-semibold">₹{course.price}</p>
          <p className="text-gray-500 text-sm">
            Enrolled: {course.enrolled} students
          </p>
        </div>
      </div>
      <button
        onClick={handleLiveSession}
        className="mt-2"
        style={{ color: "white" }}
      >
        Take live session
      </button>
    </div>
  );
}

export default PublishedCourseCard;
