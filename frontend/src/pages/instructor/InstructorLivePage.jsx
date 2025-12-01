import peers from "@/service/peer";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "@/context/SocketProvider";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const InstructorLivePage = () => {
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [instructorStream, setInstructorStream] = useState(null);
  const instructorStreamRef = useRef(null);
  const [connectedStudents, setConnectedStudents] = useState(new Set());
  const [pendingStudents, setPendingStudent] = useState([]);
  const [liveCharts, setLiveCharts] = useState([]);
  const [message, setmessage] = useState("");
  const { courseId } = useParams();
  const user = useSelector((state) => state.user.user);
  const socket = useSocket();
  const chatDivRef = useRef();

  const handleUserJoined = useCallback(
    async (data) => {
      const stream = instructorStreamRef.current;
      console.log("stream", stream);
      if (!stream) {
        console.log("student pending");
        setPendingStudent((prev) => [...prev, data.joinedStudent]);
        return;
      }
      setConnectedStudents((prev) => new Set(prev).add(data.joinedStudent));
      const offer = await peers.getOffer(data.joinedStudent, stream);
      socket.emit("offer", { id: data.joinedStudent, offer });
      peers.handleICECandidate(socket, data.joinedStudent);
    },
    [socket]
  );

  const handleReceiveMessage = useCallback((data) => {
    console.log(data)
    setLiveCharts((prev)=>{
      if (prev.length === 10) {
        return [data]
      }
      return [...prev, data]
    })
  }, []);

  const handelUserAnswer = useCallback(
    async ({ id, answer }) => {
      await peers.setRemoteAnswer(id, answer);
    },
    [socket]
  );

  const handleStartStream = async () => {
    if (!isStreaming) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setInstructorStream(stream);

      const allStudents = [...connectedStudents, ...pendingStudents];

      console.log("all students:", allStudents);

      for (let studentId of allStudents) {
        console.log("studentId", studentId);
        const offer = await peers.getOffer(studentId, stream);
        socket.emit("offer", { id: studentId, offer });
        peers.handleICECandidate(socket, studentId);
      }
    } else {
      instructorStream?.getTracks().forEach((track) => track.stop());
      setInstructorStream(null);
    }
    setIsStreaming((prev) => !prev);
  };

  useEffect(() => {
    instructorStreamRef.current = instructorStream;
  }, [instructorStream]);

  useEffect(() => {
    socket.on("student:joined", handleUserJoined);
    socket.on("answer", handelUserAnswer);
    socket.on("receiveMessage", handleReceiveMessage);

    socket.on("ice-candidate", ({ fromId, candidate }) => {
      const peer = peers.peers.get(fromId);
      if (candidate && peer) {
        peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("student:joined", handleUserJoined);
      socket.off("answer", handelUserAnswer);
      socket.off("ice-candidate");
    };
  }, []);

  useEffect(() => {
    const el = chatDivRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [liveCharts]);

  const toggleChat = () => {
    setIsChatEnabled((prev) => !prev);
  };

  return (
    <div className=" dark:bg-gray-900">
      {/* Streaming Section */}
      <div className="relative h-[320px] md:h-full bg-black md:rounded-2xl mt-1 shadow-lg overflow-hidden w-full max-w-5xl mx-auto aspect-video">
        <video
          id="instructor-video"
          className="w-full h-full object-cover"
          autoPlay
          ref={(videoEl) => {
            if (videoEl && instructorStream) {
              videoEl.srcObject = instructorStream;
              videoEl.volume = 1.0;
            }
          }}
          muted={true}
          playsInline
        ></video>

        {/* Live Badge + View Count */}
        {isStreaming && (
          <div className="absolute top-5 left-5 flex items-center gap-2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
            <span className="animate-pulse">🔴 Live</span>
            <span>• {connectedStudents.size} watching</span>
          </div>
        )}

        {/* Control Buttons */}
        <div className="absolute bottom-5 right-5 flex gap-3">
          <button
            onClick={toggleChat}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-lg text-sm shadow-md transition"
          >
            {isChatEnabled ? "Disable Chat" : "Enable Chat"}
          </button>
          <button
            onClick={handleStartStream}
            className={`${
              isStreaming
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-600 hover:bg-green-700"
            } text-white px-4 py-1.5 rounded-lg text-sm shadow-md transition`}
          >
            {isStreaming ? "Stop Stream" : "Start Stream"}
          </button>
        </div>
      </div>

      {/* Chat Section */}
      {isChatEnabled && (
        <div className="relative flex flex-col mt-10 h-[300px] bg-gray-800 rounded-t-xl p-4 shadow-inner border-t border-gray-500">
          <h2 className="text-xl font-semibold mb-3 text-gray-200">
            Live Chat
          </h2>

          <div
            ref={chatDivRef}
            className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar "
          >
            {liveCharts?.map((chats) => (
              <>
                <div className="bg-gray-600 px-3 py-1 rounded-sm w-fit max-w-[70%]">
                  <span className="font-semibold text-sm text-blue-400">
                    {chats.from}:
                  </span>{" "}
                  <span className="font-semibold text-sm text-gray-300">
                    {chats.message}
                  </span>
                </div>
              </>
            ))}
          </div>

          {/* Chat Input - Disabled for instructor */}
          {/* <form className="mt-3 flex">
            <input
              type="text"
              disabled
              value={message}
              onChange={(e) => setmessage(e.target.value)}
              placeholder="Instructor can't chat..."
              className="flex-1 bg-gray-200 px-4 py-2 rounded-l-lg text-sm outline-none"
            />
            <button
              disabled
              style={{ borderRadius: "0px 4px 4px 0px" }}
              className="bg-gray-400 text-white px-5 py-2 cursor-not-allowed"
              onClick={handleSendChat}
            >
              Send
            </button>
          </form> */}
        </div>
      )}
    </div>
  );
};

export default InstructorLivePage;
