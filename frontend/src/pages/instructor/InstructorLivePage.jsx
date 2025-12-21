import peers from "@/service/peer";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "@/context/SocketProvider";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;

const InstructorLivePage = () => {
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const navigate = useNavigate();
  const [isStreaming, setIsStreaming] = useState(false);
  const [instructorStream, setInstructorStream] = useState(null);
  const instructorStreamRef = useRef(null);
  const [connectedStudents, setConnectedStudents] = useState(new Set());
  const [pendingStudents, setPendingStudent] = useState([]);
  const [liveCharts, setLiveCharts] = useState([]);
  const [isMute, setMute] = useState(false);
  const [message, setmessage] = useState("");
  const [liveCount, setLiveCount] = useState(0);
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
    console.log(data);
    setLiveCharts((prev) => {
      if (prev.length === 10) {
        return [data];
      }
      return [...prev, data];
    });
  }, []);

  const handelUserAnswer = useCallback(
    async ({ id, answer }) => {
      await peers.setRemoteAnswer(id, answer);
    },
    [socket]
  );

  const handleLiveStreamCount = useCallback(({ increase }) => {
    setLiveCount((prev) => prev + increase);
  });
  const handleLiveStreamCountDecrease = useCallback(({ decrease }) => {
    setLiveCount((prev) => prev - decrease);
  });

  const handleStartStream = async () => {
    if (!isStreaming) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      stream.getAudioTracks()[0].enabled = true;

      setInstructorStream(stream);
      instructorStreamRef.current = stream; // ensure ref is updated immediately

      const allStudents = [...connectedStudents, ...pendingStudents];
      for (let studentId of allStudents) {
        const offer = await peers.getOffer(studentId, stream);
        socket.emit("offer", { id: studentId, offer });
        peers.handleICECandidate(socket, studentId);
      }
    } else {
      if (instructorStream) {
        instructorStream.getTracks().forEach((t) => t.stop());
      }
      setInstructorStream(null);
    }

    setIsStreaming((prev) => !prev);
  };

  const handleMuteToggle = () => {
    const stream = instructorStreamRef.current;
    if (!stream) return;

    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setMute(!audioTrack.enabled);

    peers.peers.forEach((peerConnection, studentId) => {
      const sender = peerConnection
        .getSenders()
        .find((s) => s.track && s.track.kind === "audio");

      if (sender) {
        sender.replaceTrack(audioTrack);
      }
    });
  };

  const handleStreamEnd = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_URL}/api/live-stream/live-classes-end`
      );

      socket.emit("instructor:end-stream", {
        courseId,
      });

      // Stop camera & mic completely
      if (instructorStreamRef.current) {
        instructorStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        instructorStreamRef.current = null;
      }

      // close WebRTC connections to all students
      peers.peers.forEach((peerConnection, studentId) => {
        peerConnection.close();
        peers.peers.delete(studentId);
        console.log("Disconnected student:", studentId);
      });

      setInstructorStream(null);
      navigate("/instructor-dashboard");
    } catch (error) {
      console.log("Stream end error:", error);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    instructorStreamRef.current = instructorStream;
  }, [instructorStream]);

  useEffect(() => {
    socket.on("student:joined", handleUserJoined);
    socket.on("answer", handelUserAnswer);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("increase_live_view", handleLiveStreamCount);
    socket.on("decrease_live_view", handleLiveStreamCountDecrease);

    socket.on("ice-candidate", ({ fromId, candidate }) => {
      const peer = peers.peers.get(fromId);
      if (candidate && peer) {
        peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("student:joined", handleUserJoined);
      socket.off("answer", handelUserAnswer);
      socket.off("increase_live_view", handleLiveStreamCount);
      socket.off("decrease_live_view", handleLiveStreamCountDecrease);
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
    <>
      <div className="absolute text-center z-1000 flex flex-col justify-center sm:left-10 top-26 right-10">
        <LogOut
          onClick={handleStreamEnd}
          size={26}
          className="cursor-pointer"
          color="red"
        />
      </div>
      <div className="dark:bg-gray-900 relative flex flex-col md:flex-row max-w-6xl mx-auto gap-4 p-4">
        {/* Video Section */}
        <div className="relative w-full md:w-2/3 bg-black rounded-lg overflow-hidden shadow-lg">
          <video
            id="instructor-video"
            className="w-full h-[300px] md:h-[420px] object-cover"
            autoPlay
            muted={true}
            playsInline
            ref={(videoEl) => {
              if (videoEl && instructorStream) {
                videoEl.srcObject = instructorStream;
              }
            }}
          ></video>

          {/* Live Badge */}
          {isStreaming && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full shadow-md text-xs md:text-sm">
              <span className="animate-pulse">🔴 Live</span>
              <span>• {liveCount} watching</span>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            <div
              onClick={toggleChat}
              className="bg-yellow-500  cursor-pointer hover:bg-yellow-600 text-white text-xs md:text-sm px-3 py-1 rounded-lg shadow-md transition"
            >
              {isChatEnabled ? "Disable Chat" : "Enable Chat"}
            </div>
            <div
              onClick={handleStartStream}
              className={`text-white text-xs cursor-pointer md:text-sm px-3 py-1 rounded-lg shadow-md transition ${
                isStreaming
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isStreaming ? "Stop Stream" : "Start Stream"}
            </div>
            <span
              onClick={handleMuteToggle}
              className={`text-white text-xs cursor-pointer md:text-sm px-3 py-1 rounded-lg shadow-md transition ${
                isMute
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              {isMute ? "unmute" : "mute"}
            </span>
          </div>
        </div>

        {/* Chat Section */}
        {isChatEnabled && (
          <div className="w-full md:w-1/3 h-[260px] md:h-[420px] bg-gray-800 rounded-lg p-3 shadow-inner border border-gray-600 flex flex-col">
            <h2 className="text-gray-100 font-semibold mb-2 text-sm md:text-base">
              Live Chat
            </h2>

            <div
              ref={chatDivRef}
              className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar"
            >
              {liveCharts.map((c, index) => (
                <div
                  key={index}
                  className="bg-gray-700 px-3 py-1 rounded-md text-sm max-w-[80%]"
                >
                  <span className="text-blue-400 font-semibold">{c.from}:</span>{" "}
                  <span className="text-gray-200">{c.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InstructorLivePage;
