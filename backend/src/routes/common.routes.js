import Router from "express";
import {
  saveUserToCorrectTable,
  registerUser,
  passwordResetOtp,
  validateOtp,
  resetPassword
} from "../controllers/common.controller.js";
import { sendTempUser } from "../controllers/common.controller.js";
import upload from "../middlewares/multer.middelware.js";

const router = Router();

router.post("/registerUser", upload, registerUser);
router.post("/save-user", saveUserToCorrectTable);
router.get("/sendTempUser", sendTempUser);
router.post("/reset-password", passwordResetOtp);
router.post("/validate-otp", validateOtp);
router.post("/set-new-password", resetPassword);

export { router };
 