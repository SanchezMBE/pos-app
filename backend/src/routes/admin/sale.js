import { Router } from "express";
import { SaleController } from "../../controllers/admin/sale.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Admin role required for all routes
router.use(roleMiddleware(["admin"]));

// Routes
router.get("/", SaleController.getAll);
router.post("/", SaleController.create);

// router.get("/:id", SaleController.getById);
// router.patch("/:id", SaleController.update);
// router.delete("/:id", SaleController.delete);

export default router;
