import { Router } from "express";
import {
  registerInstructorDetails,
  createCourse,
  courseTags,
  uploadCourseContent,
  publishedCourse,
  draftedCourse,
  updateDraftedCourse,
  getDraftedCourseDetail,
  publishCourse,
  getCreatedCourse,
  deleteCourse
} from "../controllers/instructor.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middelware.js";

const router = Router();

router.post("/instructor-detail", isLoggedIn, registerInstructorDetails);
router.post("/create-course", isLoggedIn, upload, createCourse);
router.post("/course-tags", isLoggedIn, courseTags);
router.post("/upload-content", isLoggedIn, upload, uploadCourseContent);
router.get("/get-published-course", isLoggedIn, publishedCourse);
router.get("/get-drafted-course", isLoggedIn, draftedCourse);
router.get(
  "/get-drafted-course-details/:courseId",
  isLoggedIn,
  getDraftedCourseDetail
);
router.post("/update-drafted-course/:id", isLoggedIn, updateDraftedCourse);
router.post("/publish-course", isLoggedIn, publishCourse);
router.get("/created-course", isLoggedIn, getCreatedCourse);
router.put("/delete-course", isLoggedIn, deleteCourse);

export { router };
