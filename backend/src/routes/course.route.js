import express from "express"
import { getCourse } from "../controllers/course.controller.js"

const router = express.Router()

// Getting the course
router.get("/:id", getCourse)


export default router