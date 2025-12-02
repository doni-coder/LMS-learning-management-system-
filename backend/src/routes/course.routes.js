import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { getSingleCourseDetail } from "../controllers/suggestion.controller.js"
import { coursePayment, checkOutProductDetail, getEnrolledCourse, getCourseContent, updateCourseCompletionStatus } from "../controllers/course.controller.js";

const router = Router();

router.post("/course-payment", isLoggedIn, coursePayment)
router.get("/checkout/:sessionId", isLoggedIn, checkOutProductDetail)
router.get("/enrolled-course", isLoggedIn, getEnrolledCourse)
router.get("/course-content/:courseId", isLoggedIn, getCourseContent)
router.get("/get-single-course-detail/:courseId", getSingleCourseDetail)
router.post("/update-course-progress", isLoggedIn, updateCourseCompletionStatus)

export { router }