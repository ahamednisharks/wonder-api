import { Router } from "express";
import { OrdersController } from "./controller";
import { upload } from "../middleware/upload"; // ✅ reuse

const router = Router();

// router.post("/save", OrdersController.create);
router.post(
    "/save",
    upload.array("designFiles"), // 🔥 KEY
    OrdersController.create
  );
router.post("/list", OrdersController.getAll);
router.post("/get", OrdersController.getById);
router.post("/delete", OrdersController.remove);

export default router;
