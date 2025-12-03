import React, { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDriveFolderUpload } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setTempCourse } from "@/reduxStore/courseSlice";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
axios.defaults.withCredentials = true;
import { Plus } from "lucide-react";
import FullScreenLoader from "@/components/FullScreenLoader";
import FullScreenProcessing from "@/components/FullScreenProcessing";

const CreateCourse = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const tempCourse = useSelector((state) => state.course.tempCourse);
  const [step, setStep] = useState(1);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isProcessing, setProcessing] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [modulePrefix, setModulePrefix] = useState("");
  const [moduleVideos, setModuleVideos] = useState([]);
  const [create, setCreate] = useState(false);
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

  const handleThumbnail = () => {
    imgInputRef.current.click();
  };

  const handleVideo = () => {
    videoInputRef.current.click();
  };

  const handleStepOneChange = (e) => {
    setStepOneData({ ...stepOneData, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setStepOneData({ ...stepOneData, thumbnail: file });
    setThumbnailPreview(URL.createObjectURL(file));
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
        title: `${modulePrefix}`,
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
        `${import.meta.env.VITE_API_URL}/api/instructor/create-course`,
        formData
      )
      .then((response) => {
        console.log("res:", response);
        dispatch(setTempCourse(response.data.course));
        setLoading(false);
        toast.success("Course created successfully");
        setStep((prev) => prev + 1);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error.response.data.message);
        alert(error.response.data.message);
      });
  };

  const handleStepTwo = async (e) => {
    console.log("Step Two Data:", stepTwoData.tags);
    setLoading(true);
    const response = await axios
      .post(`${import.meta.env.VITE_API_URL}/api/instructor/course-tags`, {
        tags: stepTwoData.tags,
        courseId: tempCourse.id,
      })
      .then((response) => {
        setLoading(false);
        console.log("Tags added successfully");
        dispatch(setTempCourse({ ...tempCourse, tags: stepTwoData.tags }));
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
    setProcessing(true);
    stepThreeData.modules.forEach((mod) => {
      formData.append("videos", mod.video);
    });

    stepThreeData.modules.forEach((mod) => {
      formData.append("title", mod.title);
    });
    await axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/instructor/upload-content`,
        formData
      )
      .then((response) => {
        setProcessing(false);
        toast.success("yahoo! course created");
      })
      .catch((error) => {
        setProcessing(false);
        toast.error("unable to create 😭");
      });
  };

  if (isLoading) {
    return <FullScreenLoader />;
  } else if (isProcessing) {
    return <FullScreenProcessing />;
  } else {
    return (
      <div className="max-w-3xl mx-auto p-6 rounded-2xl dark:bg-gray-900 dark:text-white bg-white  pt-10">
        <Toaster position="top-center" />
        <h2 className="text-2xl font-bold mb-6 text-white">
          Create New Course
        </h2>

        {create ? (
          <div className="space-y-2">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <div>
                  <label className="block font-medium mb-1">Thumbnail</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={imgInputRef}
                    onChange={handleThumbnailChange}
                    className="w-full hidden"
                  />
                  <div className="flex justify-center">
                    <div
                      onClick={handleThumbnail}
                      style={{
                        backgroundImage: `url(${thumbnailPreview})`,
                      }}
                      className="w-[100%] h-[200px] cursor-pointer bg-gray-800 rounded-sm flex justify-center items-center bg-cover bg-center sm:w-[400px] sm:h-[250px]"
                    >
                      <CiEdit size={40} color="white" />
                    </div>
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
                <div>
                  <button
                    role="button"
                    tabIndex={0}
                    onClick={handleStepOne}
                    style={{ border: "solid 1px gray" }}
                    className=" text-white px-4 border-2 border-gray-400 text-center w-full py-2 rounded cursor-pointer"
                  >
                    Next
                  </button>
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
                        className="dark:bg-gray-800 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
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
                  <label className="block font-medium mb-1">
                    Upload Videos
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    ref={videoInputRef}
                    onChange={handleModuleVideoChange}
                    className="w-full hidden"
                  />
                  <MdDriveFolderUpload onClick={handleVideo} size={50} />
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
                          className="dark:bg-gray-700 p-3 rounded shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-semibold">{mod.title}</p>
                            <p className="text-sm text-gray-400">
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
                        Create course
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div
            onClick={() => setCreate(true)}
            className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 cursor-pointer transition transform hover:scale-105"
          >
            <Plus className="w-6 h-6" />
          </div>
        )}
      </div>
    );
  }
};

export default CreateCourse;
