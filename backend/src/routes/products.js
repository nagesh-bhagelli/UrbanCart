import express from "express";
import * as ctrl from "../controllers/productController.js";
const router = express.Router();

router.get("/", ctrl.listProducts);
router.get("/:sku", ctrl.getProduct);
router.post("/", ctrl.createProduct);
router.put("/:sku", ctrl.updateProduct);
router.delete("/:sku", ctrl.deleteProduct);

export default router;
