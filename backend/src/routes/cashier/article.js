import { Router } from "express";
import { ArticleController } from "../../controllers/cashier/article.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(["cashier"]));

router.get("/", ArticleController.getAll);

router.get("/:id", ArticleController.getById);

export default router;
