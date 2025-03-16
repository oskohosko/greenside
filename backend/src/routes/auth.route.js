import express from "express"
import { login, logout, signup, checkAuth } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

// Basic auth endpoints
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

// And one to check if the userr is authenticated
// Do this when refreshing
router.get("/check", protectRoute, checkAuth)

export default router