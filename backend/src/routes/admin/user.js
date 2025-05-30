import { Router } from "express";
import { UserController } from "../../controllers/admin/user.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddleware.js";
import { validateMiddleware } from "../../middlewares/validateMiddleware.js";
import { getUserSchema } from "../../schemas/user.js";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

router.get("/", UserController.getAll);
router.post("/", UserController.create);

router.get("/:id", UserController.getById);
router.patch("/:id", validateMiddleware(getUserSchema("update")), UserController.update);
router.delete("/:id", UserController.delete);

export default router;
