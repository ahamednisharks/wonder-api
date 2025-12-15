import { Router } from "express";
import { UnitController } from "./controller";

const router = Router();

router.post("/create", UnitController.create);
router.post("/list", UnitController.getAll);
router.post("/get", UnitController.getById);
router.post("/update", UnitController.update);
router.post("/delete", UnitController.remove);

export default router;
