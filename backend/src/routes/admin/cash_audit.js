import { Router } from "express";
import { CashAuditController } from "../../controllers/admin/cash_audit.js";

const router = Router();

router.get("/", CashAuditController.getAll);
router.post("/", CashAuditController.create);

router.get("/:id", CashAuditController.getById);

export default router;
