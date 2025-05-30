import { Router } from "express";
import { AuthController } from "../controllers/auth.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authLimiter, authMeLimiter } from "../middlewares/rateLimiters.js";

const router = Router();

router.post("/signup", authLimiter, AuthController.signup);

router.post("/login", authLimiter, AuthController.login);

router.post("/logout", authLimiter, AuthController.logout);

router.get("/me", authMiddleware, authMeLimiter, AuthController.getMe);

export default router;
