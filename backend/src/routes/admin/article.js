import { Router } from "express";
import { ArticleController } from "../../controllers/admin/article.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddleware.js";
import { validateMiddleware } from "../../middlewares/validateMiddleware.js";
import { z } from "zod";
import { getArticleSchema } from "../../schemas/article.js";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

router.get("/", ArticleController.getAll);

// POST requiere todos los campos
router.post("/", validateMiddleware(getArticleSchema()), ArticleController.create);

// PUT permite campos parciales
router.put("/:id", validateMiddleware(getArticleSchema({ partial: true })), ArticleController.update);

// Schema solo para params
const codeParamSchema = z.object({
  code: getArticleSchema({ fields: { code: true } }).shape.code
});

const barcodeParamSchema = z.object({
  barcode: getArticleSchema({ fields: { barcode: true } }).shape.barcode
});

router.get("/code/:code", validateMiddleware(codeParamSchema, "params"), ArticleController.getByCode);

router.get("/barcode/:barcode", validateMiddleware(barcodeParamSchema, "params"), ArticleController.getByBarcode);

router.get("/:id", ArticleController.getById);
router.delete("/:id", ArticleController.delete);

export default router;
