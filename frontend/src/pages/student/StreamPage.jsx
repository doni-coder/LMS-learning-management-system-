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
  const [message, setmessage] = useState("");
  const { id } = useParams();

  console.log("id", id);

  const handleMessageReceive = useCallback((data) => {
    setLiveCharts((prev) => {
      console.log("prev.length", prev.length);

      if (prev.length >= 10) {
        return [data];
      }
      return [...prev, data];
    });

    console.log("data", data);
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
    setmessage("")
  };

  const handleOffer = useCallback(
    async (data) => {
      console.log("data", { data });
      const answer = await peers.getAnswer(data.id, data.offer);
      socket.emit("answer", { courseId: id, ans: answer });

      peers.onTrack(data.id, (stream) => {
        console.log("📥 Got remote stream:", stream);
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
      console.log("peer-ice-candidate:", { candidate, fromId });
      if (peer && candidate) {
        peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
    socket.on("receiveMessage", handleMessageReceive);
    socket.emit("joinChatRoom", { courseId: id });

    return () => {
      socket.off("offer", handleOffer);
      socket.off("ice-candidate");
      socket.off("receiveMessage", handleMessageReceive);
    };
  }, [socket, handleOffer]);

  return (
    <div className="min-h-screen dark:bg-gray-900 p-4 flex flex-col gap-4">
      {/* Live Stream Section */}
      <div className="relative bg-black rounded-2xl shadow-lg overflow-hidden w-full max-w-5xl mx-auto aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={true}
          className="w-full h-full object-cover"
        />

        {/* Viewer Count */}
        <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm shadow-md">
          👁️ 213 watching
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col w-full max-w-5xl mx-auto  rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b text-sm font-semibold dark:bg-gray-600">
          💬 Live Chat
        </div>

        <div className="h-64 overflow-y-auto p-4  space-y-3 text-sm text-gray-300 dark:bg-gray-800">
          {liveCharts?.map((chat) => (
            <>
              <div className="flex gap-2 items-start">
                <span className="font-bold">{chat.from}:</span>
                <span>{chat.message}</span>
              </div>
            </>
          ))}
        </div>

        {/* Chat input */}
        <div className="flex items-center gap-2 p-4 border-t bg-gray-900">
          <input
            type="text"
            value={message}
            onChange={(e) => setmessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-full outline-none text-sm focus:ring-1 focus:ring-gray-300"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default StreamPage;
