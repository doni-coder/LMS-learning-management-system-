import Router from "express";
import { suggestPagenatedCourses } from "../controllers/suggestion.controller.js";


const router = Router();
router.post("/explore-course",suggestPagenatedCourses)

export  {router};