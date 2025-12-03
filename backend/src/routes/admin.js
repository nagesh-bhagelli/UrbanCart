import express from "express";
import { requireAdmin } from "../middleware/adminAuth.js";
import * as adminController from "../controllers/adminController.js";
import * as productController from "../controllers/productController.js";

const router = express.Router();

// Admin middleware - all routes require admin role
router.use(requireAdmin);

// Order management
router.get("/orders", adminController.getAllOrders);
router.patch("/orders/:orderId", adminController.updateOrderStatus);
router.get("/orders/summary", adminController.getOrderSummary);

// Inventory management
router.get("/inventory/summary", adminController.getInventorySummary);
router.get("/inventory/low-stock", adminController.getLowStockProducts);
router.patch("/inventory/:sku", adminController.updateProductInventory);

// Product management
router.post("/products", productController.createProduct);
router.patch("/products/:sku", productController.updateProduct);
router.delete("/products/:sku", productController.deleteProduct);

export default router;
