import express from "express";
import cors from "cors";
import morgan from "morgan";
import productsRoutes from "./routes/products.js";
import ordersRoutes from "./routes/orders.js";
import streamRoutes from "./routes/stream.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/admin", adminRoutes);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

export default app;
