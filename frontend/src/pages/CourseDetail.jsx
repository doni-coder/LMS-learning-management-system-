import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, setCartMessage } from "@/reduxStore/cartSlice";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
import FullScreenLoader from "@/components/FullScreenLoader";

function CourseDetail({ course }) {
  const { courseId } = useParams();
  const userRole = useSelector((state) => state.user.userRole);
  const user = useSelector((state) => state.user.user);
  const cartMessage = useSelector((state) => state.cart.cartMessage);
  const [coursedetails, setCourseDetail] = useState({});
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    const courseDetail = async () => {
      await axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/course/get-single-course-detail/${courseId}`
        )
        .then((response) => {
          console.log("response", response.data);
          setCourseDetail(response.data?.course);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    };
    courseDetail();
  }, [courseId]);

  useEffect(() => {
    console.log("cart message", cartMessage);
    if (cartMessage) {
      toast.message(cartMessage);
      dispatch(setCartMessage(null));
    }
  }, [cartMessage]);

  const handleAddToCart = () => {
    dispatch(addToCart({ item: coursedetails, userId: user.id }));
    console.log("Add to cart clicked for course:");
  };

  if (isLoading) {
    return <FullScreenLoader />;
  } else {
    return (
      <div className="max-w-5xl text-white mx-auto p-6 rounded mt-6">
        {/* Course Header */}
        <Toaster position="top-center" />
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={coursedetails?.thumbnail}
            alt="Course Thumbnail"
            className="w-full md:w-5/10 rounded-lg shadow"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{coursedetails?.title}</h1>
            <p className="text-gray-400 mt-2">{coursedetails?.description}</p>
            <p className="text-lg font-semibold mt-4 text-green-600">
              ₹{coursedetails.price}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={userRole !== "student"}
              className="mt-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              style={{
                background: "linear-gradient(135deg, black, black)",
                boxShadow: "0 0 2px #0c47f7",
                padding: "10px 20px",
                cursor: userRole === "student" ? "pointer" : "not-allowed",
              }}
            >
              Add to Cart
            </button>

            {/* Tags */}
            <div className="mt-3 flex gap-2 flex-wrap">
              {coursedetails.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Publish status */}
            <p className="mt-3 text-sm text-gray-500">
              {coursedetails.is_published ? "Published" : "Not Published"} on{" "}
              {coursedetails.created_date?.slice(0, 10)}
            </p>
          </div>
        </div>

        {/* Instructor Info */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-300">Instructor</h2>
          <div className="flex items-center gap-4 mt-3">
            <img
              src={coursedetails.instructor?.profile_pic}
              alt="Instructor"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-lg  font-bold">
                {coursedetails.instructor?.name}
              </h3>
              <p className="text-sm text-gray-300">
                About: {coursedetails.instructor?.about}
              </p>
              <p className="text-sm text-gray-300 italic">
                Experience: {coursedetails.instructor?.experience} year
              </p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-300">
            Student Reviews
          </h2>
          <div className="space-y-4 mt-3">
            {coursedetails.reviews?.length > 0 ? (
              coursedetails.reviews?.map((review) => (
                <div key={review.id} className="p-4 bg-gray-100 rounded">
                  <p className="text-sm text-gray-800">⭐ {review.points}/5</p>
                  <p className="text-gray-600">{review.review}</p>
                  <p className="text-xs text-gray-400">
                    Student ID: {review.student_id}
                  </p>
                </div>
              ))
            ) : (
              <div>
                <p className="text-gray-400">No reviews</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default CourseDetail;
