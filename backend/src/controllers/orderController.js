import { placeOrderAtomic } from "../services/orderService.js";
import Order from "../models/Order.js";

export async function placeOrder(req, res) {
  try {
    const payload = req.body;
    const order = await placeOrderAtomic(payload);
    res.status(201).json({ data: order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getUserOrders(req, res) {
  const userId = req.user._id; // Assumes auth middleware populates req.user
  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ data: orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
