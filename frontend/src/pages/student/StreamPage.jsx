import React, { useCallback, useEffect, useRef, useState } from "react";
import peers from "@/service/peer";
import { useSocket } from "@/context/SocketProvider";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function StreamPage() {
  const videoRef = useRef(null);
  const socket = useSocket();
  const user = useSelector((state) => state.user.user);
  const [liveCharts, setLiveCharts] = useState([]);
  const [isClassEnded, setClassEnd] = useState(false);
  const [message, setmessage] = useState("");
  const { id } = useParams();

  const handleMessageReceive = useCallback((data) => {
    setLiveCharts((prev) => {
      if (prev.length >= 10) {
        return [data];
      }
      return [...prev, data];
    });
  }, []);

  const handleSendMessage = () => {
    socket.emit("sendChat", {
      courseId: id,
      message,
      from: user.name,
    });
    setLiveCharts((prev) => {
      if (prev.length >= 10) {
        return [
          {
            courseId: id,
            message,
            from: "you",
          },
        ];
      }
      return [
        ...prev,
        {
          courseId: id,
          message,
          from: "you",
        },
      ];
    });
    setmessage("");
  };

  const handleStreamEnd = useCallback(() => {
    setClassEnd(true);
    setTimeout(() => {
      navigator("/student-dashboard");
    }, 4000);
  });

  const handleOffer = useCallback(
    async (data) => {
      const answer = await peers.getAnswer(data.id, data.offer);
      socket.emit("answer", { courseId: id, ans: answer });

      peers.onTrack(data.id, (stream) => {
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          console.log("🎥 Stream attached to video element");
        }
      });

      peers.handleICECandidate(socket, data.id);
    },
    [socket, id]
  );

  useEffect(() => {
    if (!socket.id) return;
  }, [socket.id]);

  useEffect(() => {
    socket.on("offer", handleOffer);

    socket.on("ice-candidate", ({ candidate, fromId }) => {
      const peer = peers.peers.get(fromId);
      if (peer && candidate) {
        peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
    socket.on("receiveMessage", handleMessageReceive);
    socket.on("stream-ended", handleStreamEnd);
    socket.emit("joinChatRoom", { courseId: id });
    socket.emit("liveJoinCount",{courseId: id })

    return () => {
      socket.off("offer", handleOffer);
      socket.off("ice-candidate");
      socket.off("receiveMessage", handleMessageReceive);
      socket.off("liveJoinCount")
      socket.emit("liveJoinCountRemove",{courseId: id })
    };
  }, [socket, handleOffer]);

  return (
    <div className="min-h-screen dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
        {/* Live Stream Video */}
        <div className="relative w-full md:w-2/3 bg-black rounded-lg overflow-hidden shadow-lg">
          {isClassEnded ? (
            <div className="w-full h-[300px] md:h-[420px] flex justify-center items-center object-cover">
              <span>Class Ended</span>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={false}
              className="w-full h-[300px] md:h-[420px] object-cover"
            />
          )}
        </div>

        {/* Live Chat Section */}
        <div className="w-full md:w-1/3 h-[300px] md:h-[420px] dark:bg-gray-800 bg-gray-100 rounded-lg shadow-inner flex flex-col">
          {/* Title */}
          <div className="px-4 py-2 border-b border-gray-600 dark:text-gray-200 font-semibold">
            💬 Live Chat
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-sm custom-scrollbar">
            {liveCharts.map((chat, index) => (
              <div
                key={index}
                className="bg-gray-700 px-3 py-1 rounded-md max-w-[85%] text-gray-200"
              >
                <span className="font-bold text-blue-400">{chat.from}: </span>
                <span>{chat.message}</span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t border-gray-700 bg-gray-900 rounded-b-lg">
            <input
              type="text"
              value={message}
              onChange={(e) => setmessage(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 px-3 py-2 rounded-lg bg-gray-200 text-black text-sm outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-md transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreamPage;
