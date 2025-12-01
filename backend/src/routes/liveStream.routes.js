import { Router } from "express";
import { getPushNotification } from "../controllers/liveStream.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router()

router.get("/get-live-classes",isLoggedIn,getPushNotification)

export { router };