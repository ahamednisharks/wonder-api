// src/routes/index.ts
import { Router } from "express";
import itemRoutes from "../item/route";
import authRoutes from "../auth/route";
import unitRoutes from "../unit/route";
import billingRoutes from "../billing/route";


const router = Router();

router.use("/items", itemRoutes);
router.use("/auth", authRoutes);
router.use("/unit", unitRoutes);
router.use("/billing", billingRoutes);



export default router;
