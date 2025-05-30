import { Router } from "express";
import { SaleController } from "../../controllers/cashier/sale.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(["cashier"]));

router.get("/", SaleController.getAll);
router.post("/", SaleController.create);

export default router;
