import { Router } from "express";
import { BusinessController } from "../../controllers/admin/business.js";

const router = Router();

router.get("/", BusinessController.getAll);
router.post("/", BusinessController.create);

router.get("/:id", BusinessController.getById);
router.patch("/:id", BusinessController.update);
router.delete("/:id", BusinessController.delete);

export default router;
