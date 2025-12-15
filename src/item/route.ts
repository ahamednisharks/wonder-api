// src/item/item.route.ts
import { Router } from "express";
import { ItemController } from "./controller";
import { upload } from "../middleware/upload";


const router = Router();

// router.post("/add-item", ItemController.create);
router.post('/add-item', upload.single('image'), ItemController.create);

router.post("/list", ItemController.getAll);
router.post("/getItem", ItemController.getById);
router.post("/update", ItemController.update);
router.post("/delete", ItemController.remove);

export default router;
