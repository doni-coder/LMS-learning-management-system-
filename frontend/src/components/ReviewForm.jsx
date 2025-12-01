import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const { courseId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/student/review`,
      {
        review,
        points: rating,
        courseId,
      }
    );
    if (response.status == 200) {
      toast.message(response.data.message);
    }
    console.log({ rating, review });
    console.log(courseId);
    setRating(0);
    setReview("");
  };

  return (
    <div className="max-w-md mx-auto px-6 pb-5  mt-5  space-y-4">
      <h2 className="text-2xl font-semibold text-center">Write a Review</h2>
      <Toaster />
      {/* Star Rating */}
      <div className="flex justify-center px-5 space-x-2">
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              style={{
                padding: "5px 5px",
                outline: "none",
                background: "transparent",
              }}
              key={star}
              whileTap={{ scale: 1.2 }}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="text-yellow-400"
            >
              <Star
                fill={(hover || rating) >= star ? "#646cff" : "none"}
                stroke="#646cff"
                className="w-4 h-4 cursor-pointer transition-transform hover:scale-110"
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Review Input */}
      <textarea
        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
        rows="4"
        placeholder="Write your review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      ></textarea>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        className="w-full bg-yellow-400 text-white font-semibold py-2 rounded-xl shadow hover:bg-yellow-500 transition"
      >
        Submit Review
      </motion.button>
    </div>
  );
}
