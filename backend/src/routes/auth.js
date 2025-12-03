import express from "express";
import * as ctrl from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);

export default router;
