import { Router } from "express";
import { BusinessController } from "../../controllers/admin/business.js";
import { validateMiddleware } from "../../middlewares/validateMiddleware.js";
import { getBusinessSchema } from "../../schemas/business.js";

const router = Router();

router.get("/", BusinessController.getAll);
router.post("/", validateMiddleware(getBusinessSchema("create")), BusinessController.create);

router.get("/:id", BusinessController.getById);
// router.patch("/:id", validateMiddleware(getBusinessSchema("update")), BusinessController.update);
router.delete("/:id", BusinessController.delete);

export default router;
