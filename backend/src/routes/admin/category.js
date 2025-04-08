import { Router } from "express";
import { ArticleController } from "../../controllers/admin/category.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Admin role required for all routes
router.use(roleMiddleware(["admin"]));

// Routes
router.get("/", ArticleController.getAll);

router.get("/:id", ArticleController.getById);

export default router;
