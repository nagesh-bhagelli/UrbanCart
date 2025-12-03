import express from "express";
import * as ctrl from "../controllers/orderController.js";
import { requireAuth } from "../middleware/auth.js"; // Need to check if this exists or use similar

const router = express.Router();

router.post("/", ctrl.placeOrder);
router.get("/my-orders", requireAuth, ctrl.getUserOrders);

export default router;
