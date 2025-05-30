import { Router } from "express";
import { ProfileController } from "../../controllers/admin/profile.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Admin role required for all routes
router.use(roleMiddleware(["admin"]));

// Routes
router.get("/me", ProfileController.getMe);

router.put("/me", ProfileController.update);
// router.put("/", validateMiddleware(articleSchema.partial()), ArticleController.update);

router.put("/business", ProfileController.updateBusiness);

export default router;
