import { Router } from "express";
import { SaleController } from "../../controllers/admin/sale.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddleware.js";
import { validateMiddleware } from "../../middlewares/validateMiddleware.js";
import { getSaleSchema } from "../../schemas/sale.js";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

router.get("/", SaleController.getAll);
router.post("/", validateMiddleware(getSaleSchema()), SaleController.create);

export default router;
