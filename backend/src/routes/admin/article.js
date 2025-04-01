import { Router } from "express";
import { ArticleController } from "../../controllers/admin/article.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddleware.js";
import { validateMiddleware } from "../../middlewares/validateMiddleware.js";
import { articleSchema } from "../../schemas/articleSchema.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Admin role required for all routes
router.use(roleMiddleware(['admin']));

// Routes
router.get("/", ArticleController.getAll);
router.post("/", validateMiddleware(articleSchema), ArticleController.create);

router.get("/:id", ArticleController.getById);
router.patch("/:id", validateMiddleware(articleSchema.partial()), ArticleController.update);
router.delete("/:id", ArticleController.delete);

export default router;