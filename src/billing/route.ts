import { Router } from "express";
import { BillingController } from "./controller";

const router = Router();

router.post("/save", BillingController.create);
router.post("/list", BillingController.getAll);
router.post("/get", BillingController.getById);
router.post("/delete", BillingController.remove);

export default router;
