import { Router } from "express";
import {
  registerStudentDetails,
  addToCart,
  removeFromCart,
  getStudentEnrolledCourse,
  getAddToCartItems,
  giveReviews,
} from "../controllers/student.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/registerStudentDetails", isLoggedIn, registerStudentDetails);
router.post("/addToCart", isLoggedIn, addToCart);
router.post("/removeFromCart", isLoggedIn, removeFromCart);
router.get("/enrolled-course", isLoggedIn, getStudentEnrolledCourse);
router.get("/cart-items", isLoggedIn, getAddToCartItems);
router.post("/review", isLoggedIn, giveReviews);

export { router };
