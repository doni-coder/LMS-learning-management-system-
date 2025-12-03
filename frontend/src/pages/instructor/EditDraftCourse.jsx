import React, { useEffect, useRef, useState } from "react";
import { MdDriveFolderUpload } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setDraftCourses, setTempCourse } from "../../reduxStore/courseSlice";
import axios from "axios";
axios.defaults.withCredentials = true;
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import FullScreenLoader from "@/components/FullScreenLoader";
import FullScreenProcessing from "@/components/FullScreenProcessing";

function EditDraftCourse() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const tempCourse = useSelector((state) => state.course.tempCourse);
  const [step, setStep] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [isVideoProcessing, setProcessing] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [modulePrefix, setModulePrefix] = useState("");
  const [moduleVideos, setModuleVideos] = useState([]);
  const imgInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [stepOneData, setStepOneData] = useState({
    title: "",
    description: "",
    thumbnail: null,
    price: "",
  });
  const [stepTwoData, setStepTwoData] = useState({
    tags: [],
  });
  const [stepThreeData, setStepThreeData] = useState({
    modules: [],
  });

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      await axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/instructor/get-drafted-course-details/${id}`
        )
        .then((response) => {
          dispatch(setTempCourse(response.data.course));
          setLoading(false);
        });
    };
    fetchCourse();
  }, []);

  useEffect(() => {
    if (tempCourse) {
      setStepOneData({
        title: tempCourse.title || "",
        description: tempCourse.description || "",
        thumbnail: tempCourse.thumbnail || "",
        price: tempCourse.price || "",
      });
    }
  }, [tempCourse]);

  const handleVideo = () => {
    videoInputRef.current.click();
  };

  const handleStepOneChange = (e) => {
    setStepOneData({ ...stepOneData, [e.target.name]: e.target.value });
  };

  const addTags = () => {
    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setStepTwoData({ ...stepTwoData, tags: [...stepTwoData.tags, ...tags] });
    setTagInput("");
  };

  const handleModuleVideoChange = (e) => {
    setModuleVideos([...e.target.files]);
  };

  const addModules = () => {
    if (moduleVideos.length > 0 && modulePrefix) {
      const newModules = moduleVideos.map((video, index) => ({
        title: `${modulePrefix} - ${index + 1}`,
        video,
      }));
      setStepThreeData({
        ...stepThreeData,
        modules: [...stepThreeData.modules, ...newModules],
      });
      setModulePrefix("");
      setModuleVideos([]);
    }
  };

  const handleStepOne = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", stepOneData.title);
    formData.append("description", stepOneData.description);
    formData.append("thumbnail", stepOneData.thumbnail);
    formData.append("price", stepOneData.price);

    setLoading(true);

    await axios
      .post(
        `${
          import.meta.env.VITE_API_URL
        }/api/instructor/update-drafted-course/${id}`,
        {
          title: formData.get("title"),
          description: formData.get("description"),
          price: formData.get("price"),
        }
      )
      .then((response) => {
        dispatch(setTempCourse(response.data.course));
        setLoading(false);
        toast.success("Course created successfully");
        setStep((prev) => prev + 1);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Failed to create course");
      });
  };

  const handleStepTwo = async (e) => {
    setLoading(true);
    await axios
      .post(`${import.meta.env.VITE_API_URL}/api/instructor/course-tags`, {
        tags: stepTwoData.tags,
        courseId: tempCourse.id,
      })
      .then((response) => {
        dispatch(setTempCourse({ ...tempCourse, tags: stepTwoData.tags }));
        setLoading(false);
        console.log(step);
        setStep((prev) => prev + 1);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("courseId", tempCourse.id);

    stepThreeData.modules.forEach((mod) => {
      formData.append("videos", mod.video);
    });

    stepThreeData.modules.forEach((mod) => {
      formData.append("title", mod.title);
    });
    setProcessing(true);
    await axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/instructor/upload-content`,
        formData
      )
      .then((response) => {
        setProcessing(false);
        toast.success("yahoo! course created 😀");
      })
      .catch((error) => {
        setProcessing(false);
        toast.error("unable to create 😭");
      });
  };

  if (isLoading) {
    return <FullScreenLoader />;
  } else if (isVideoProcessing) {
    return <FullScreenProcessing />;
  } else {
    return (
      <div className="max-w-3xl mx-auto p-6 pb-10 pt-8 dark:bg-gray-900 ">
        <Toaster position="top-center" />
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Edit Draft</h2>

        <div className="space-y-2">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <div>
                <label className="block font-medium mb-1">Thumbnail</label>
                <div className="flex justify-center">
                  <div
                    style={{
                      backgroundImage: `url(${tempCourse?.thumbnail})`,
                    }}
                    className="w-[100%] h-[200px] bg-gray-400 rounded-sm flex justify-center items-center bg-cover bg-center sm:w-[400px] sm:h-[250px]"
                  ></div>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Course Title</label>
                <input
                  name="title"
                  value={stepOneData.title}
                  onChange={handleStepOneChange}
                  className="w-full border px-4 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={stepOneData.description}
                  onChange={handleStepOneChange}
                  rows={3}
                  className="w-full border px-4 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={stepOneData.price}
                  onChange={handleStepOneChange}
                  className="w-full border px-4 py-2 rounded-md"
                  required
                />
              </div>
              {/*-------next button------*/}
              <div className="mt-4">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleStepOne}
                  className="bg-blue-600 text-white px-4 text-center w-full py-2 rounded hover:bg-blue-700 cursor-pointer"
                >
                  Next
                </div>
              </div>
            </>
          )}

          {/* Step 2: Tags */}
          {step === 2 && (
            <>
              <div>
                <label className="block font-medium mb-1">
                  Course Tags (comma separated)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="w-full border px-4 py-2 rounded-md"
                    placeholder="e.g. React, Frontend"
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={addTags}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer"
                  >
                    Add
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {stepTwoData.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-800 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleStepTwo}
                  className="bg-blue-600 text-white px-4 text-center w-full py-2 rounded hover:bg-blue-700 cursor-pointer"
                >
                  Next
                </div>
              </div>
            </>
          )}

          {/* Step 3: Modules */}
          {step === 3 && (
            <>
              <div>
                <label className="block font-medium mb-1">
                  Module Title Prefix
                </label>
                <input
                  value={modulePrefix}
                  onChange={(e) => setModulePrefix(e.target.value)}
                  className="w-full border px-4 py-2 mb-2 rounded-md"
                  placeholder="e.g. Getting Started"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Upload Videos</label>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  ref={videoInputRef}
                  onChange={handleModuleVideoChange}
                  className="w-full hidden"
                />
                <MdDriveFolderUpload onClick={handleVideo} color="grey" size={50} />
                <div className="flex justify-center">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={addModules}
                    className="mt-3 bg-green-600 max-w-fit text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                  >
                    Add module
                  </div>
                </div>
              </div>

              {/* Modules Preview */}
              {stepThreeData.modules.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2 text-gray-300">
                    Preview Modules
                  </h4>
                  <ul className="space-y-3">
                    {stepThreeData.modules.map((mod, index) => (
                      <li
                        key={index}
                        className="bg-gray-800 p-3 rounded shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-semibold">{mod.title}</p>
                          <p className="text-sm text-gray-600">
                            {mod.video?.name}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={handleSubmit}
                      className="bg-blue-600 text-white px-4 text-center mt-3 w-full py-2 rounded hover:bg-blue-700 cursor-pointer"
                    >
                      Submit
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default EditDraftCourse;
