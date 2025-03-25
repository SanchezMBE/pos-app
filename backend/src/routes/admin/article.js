import { Router } from "express";
import { ArticleController } from "../../controllers/admin/article.js";

const router = Router();

router.get("/", ArticleController.getAll);
router.post("/", ArticleController.create);

router.get("/:id", ArticleController.getById);
router.patch("/:id", ArticleController.update);
router.delete("/:id", ArticleController.delete);

export default router;
