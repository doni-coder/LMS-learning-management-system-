import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import axios from "axios";
axios.defaults.withCredentials = true;

const VideoPlayer = ({ videoUrl, enrolledCourseId, totalModule, moduleNo }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [watchedSecond, setWatchedSecond] = useState(new Set());
  const progressUpdateRef = useRef(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const player = videojs(videoRef.current, {
      controls: true,
      playbackRates: [0.5, 1, 1.5, 2],
      autoplay: false,
      preload: "auto",
      responsive: true,
      fluid: true,
      sources: [
        {
          src: videoUrl,
          type: "video/mp4",
        },
      ],
    });

    player.on("timeupdate", () => {
      const currentTime = Math.floor(player.currentTime());
      const duration = Math.floor(player.duration());

      setWatchedSecond((prev) => {
        let newSet = new Set(prev);
        newSet.add(currentTime);

        const watchedPercentage = (newSet.size / duration) * 100;
        console.log(watchedPercentage);
        console.log(progressUpdateRef.current);

        if (watchedPercentage >= 90 && progressUpdateRef.current === false) {
          progressUpdateRef.current = true;
          setTimeout(() => {
            axios
              .post(
                `${
                  import.meta.env.VITE_API_URL
                }/api/course/update-course-progress`,
                {
                  courseId: enrolledCourseId,
                  totalModule,
                  moduleNo,
                }
              )
              .then((response) => {
                if (response.status === 200) {
                  console.log("progress:", response.data);
                }
              })
              .catch((error) => {
                console.error("Progress update error:", error);
              });
          }, 0);
        }

        return newSet;
      });
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [videoUrl]);

  return (
    <div className=" overflow-hidden rounded-xl" data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;
