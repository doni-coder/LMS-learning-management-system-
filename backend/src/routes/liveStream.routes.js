import { Router } from "express";
import { getPushNotification,liveStreamEndHandle } from "../controllers/liveStream.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router()

router.get("/get-live-classes",isLoggedIn,getPushNotification)
router.get("/live-classes-end",isLoggedIn,liveStreamEndHandle)

export { router };