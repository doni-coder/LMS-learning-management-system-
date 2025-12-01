import React, { useState, useEffect } from "react";
import { CiPlay1 } from "react-icons/ci";
import VideoPlayer from "@/components/VideoPlayer";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ReviewForm from "@/components/ReviewForm";
import { useDispatch } from "react-redux";
import FullScreenLoader from "@/components/FullScreenLoader";
import { setLoading } from "@/reduxStore/appSlice";

// const courseContent = {
//   courseId: "course_001",
//   content: [
//     {
//       title: "Introduction to React",
//       videoUrl: [
//         {
//           url: "https://www.w3schools.com/html/movie.mp4",
//           resolution: 720,
//         },
//         {
//           url: "https://www.w3schools.com/html/movie.mp4",
//           resolution: 1080,
//         },
//       ],
//       status: "success",
//       duration: "5:30",
//       createdOn: new Date("2025-06-01"),
//     },
//     {
//       title: "React State Management",
//       videoUrl: [
//         {
//           url: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
//           resolution: 720,
//         },
//       ],
//       status: "success",
//       duration: "10:45",
//       createdOn: new Date("2025-06-02"),
//     },
//     {
//       title: "React Routing",
//       videoUrl: [
//         {
//           url: "https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4",
//           resolution: 720,
//         },
//       ],
//       status: "success",
//       duration: "7:20",
//       createdOn: new Date("2025-06-03"),
//     },
//     {
//       title: "React Forms",
//       videoUrl: [
//         {
//           url: "https://www.publicdomainfiles.com/download_video/Big_Buck_Bunny_720p.mp4",
//           resolution: 720,
//         },
//       ],
//       status: "success",
//       duration: "8:15",
//       createdOn: new Date("2025-06-04"),
//     },
//     {
//       title: "React Hooks",
//       videoUrl: [
//         {
//           url: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
//           resolution: 720,
//         },
//       ],
//       status: "success",
//       duration: "9:30",
//       createdOn: new Date("2025-06-05"),
//     },
//     {
//       title: "React Context API",
//       videoUrl: [
//         {
//           url: "https://www.w3schools.com/html/movie.mp4",
//           resolution: 720,
//         },
//       ],
//       status: "success",
//       duration: "6:10",
//       createdOn: new Date("2025-06-06"),
//     },
//     {
//       title: "React Lifecycle Methods",
//       videoUrl: [
//         {
//           url: "https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4",
//           resolution: 720,
//         },
//       ],
//       status: "success",
//       duration: "8:00",
//       createdOn: new Date("2025-06-07"),
//     },
//     {
//       title: "React Advanced Concepts",
//       videoUrl: [
//         {
//           url: "https://www.publicdomainfiles.com/download_video/Big_Buck_Bunny_720p.mp4",
//           resolution: 720,
//         },
//       ],
//       status: "success",
//       duration: "10:00",
//       createdOn: new Date("2025-06-08"),
//     },
//   ],
// };

const CourseContent = () => {
  const isLoading = useSelector((state) => state.app.isLoading);
  const dispatch = useDispatch()
  const [courseContents, setCourseContents] = useState([]);
  const { courseId } = useParams();
  const enrolledCourseId = useSelector(
    (state) => state.course.currentEnrolledCourse
  );

  useEffect(() => {
    console.log("enrolledCourseId:", enrolledCourseId);
  }, [enrolledCourseId]);

  const getFirstVideoUrl = (content) =>
    content.find((c) => c.videoUrl.length > 0)?.videoUrl[0]?.url || null;

  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      dispatch(setLoading())
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/course/course-content/${courseId}`
      );
      if (response.status == 200) {
        setCourseContents(response.data.courseContent.reverse());
        setCurrentVideo(getFirstVideoUrl(response.data.courseContent));
        dispatch(setLoading())
        console.log("content:", response.data.courseContent);
      }
    };
    fetchContent();
  }, []);

  const [selectModule, setSelectModule] = useState(0);
  console.log("current vidoe:", courseContents);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <div className="md:flex md:items-center justify-center p-0">
        <div className="dark:bg-gray-800 md:border md:rounded-lg p-6 md:shadow-md w-full max-w-6xl">
          {/* Responsive layout: column on mobile, row on medium+ */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Video Player */}
            <div className="w-full md:w-2/3">
              {currentVideo ? (
                <VideoPlayer
                  videoUrl={currentVideo}
                  enrolledCourseId={enrolledCourseId}
                  totalModule={courseContents.length}
                  moduleNo={selectModule}
                  key={currentVideo}
                />
              ) : (
                <div className="text-center text-gray-500 border p-10 rounded">
                  No video available
                </div>
              )}
            </div>

            {/* Modules List */}
            <div className="w-full md:w-1/3">
              <h2 className="text-lg font-semibold mb-3 text-gray-300">
                Modules:
              </h2>
              <div className="space-y-3 scroll-box">
                {courseContents?.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      item.videoUrl.length > 0 &&
                        setCurrentVideo(item.videoUrl[0].url);
                      setSelectModule(idx);
                    }}
                    className={`w-full border ${
                      selectModule == idx ? "bg-[#646cff] text-white" : ""
                    } px-4 py-2 cursor-pointer text-left rounded  transition duration-200 flex justify-between items-center`}
                  >
                    <div className="flex  w-full items-center justify-between">
                      <div>
                        <span>{item.title.slice(0, 20)} ..</span>
                      </div>
                      <div className="flex gap-1 items-center">
                        {/* <span className="text-sm">{item.duration || 10} min</span> */}
                        <span>
                          <CiPlay1 />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ReviewForm />
      </div>
    </>
  );
};

export default CourseContent;
