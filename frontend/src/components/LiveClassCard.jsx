import React from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/context/SocketProvider";

function LiveClassCard({ name, instructor, courseId }) {
  const navigate = useNavigate();
  const socket = useSocket();
  const handleJoin = () => {
    console.log("name:", name);
    console.log("instructor:", instructor);
    console.log("courseId:", courseId);
    console.log("handle join");
    socket.emit("join:stream", { courseId });

    socket.once("joined", (data) => {
      navigate(`/live-class/${courseId}`);
    });
  };

  return (
    <div className="dark:bg-gray-800 shadow-md rounded-2xl p-4 flex flex-col gap-2 border border-gray-200 w-full max-w-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-300">{name}</h2>
        <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full">
          Live
        </span>
      </div>
      <p className="text-gray-400 text-sm">Instructor: {instructor}</p>
      <button
        onClick={handleJoin}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Join Now
      </button>
    </div>
  );
}

export default LiveClassCard;
