import { Router } from "express";
import { AuthController } from "../controllers/auth.js";

const router = Router();

router.post("/signup", AuthController.signup);

router.post("/login", AuthController.login);

// router.post("/request-verification", AuthController.requestVerification)

// router.post("/verify-code", AuthController.verifyCode);

// router.post("/reset-password", AuthController.resetPassword)

export default router;
