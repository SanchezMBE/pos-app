import { Router } from "express";
import { UserController } from "../../controllers/admin/user.js";

const router = Router();

router.get("/", UserController.getAll);
router.post("/", UserController.create);

router.get("/:id", UserController.getById);
router.patch("/:id", UserController.update);
router.delete("/:id", UserController.delete);

export default router;
