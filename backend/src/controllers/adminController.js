import Product from "../models/Product.js";
import Order from "../models/Order.js";

// Low stock threshold
const LOW_STOCK_THRESHOLD = 20;

// Get all orders with user details
export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json({ data: orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update order delivery status
export async function updateOrderStatus(req, res) {
  const { orderId } = req.params;
  const { delivered, status } = req.body;

  try {
    const updates = { updatedAt: new Date() };

    if (delivered !== undefined) {
      updates.delivered = delivered;
      if (delivered) {
        updates.deliveredAt = new Date();
        updates.status = "delivered";
      } else {
        updates.deliveredAt = null;
        updates.status = "processing";
      }
    }

    if (status) {
      updates.status = status;
    }

    const order = await Order.findByIdAndUpdate(orderId, updates, {
      new: true,
    }).populate("userId", "username email");

    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ data: order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get low stock products
export async function getLowStockProducts(req, res) {
  try {
    const lowStockProducts = await Product.find({
      "inventory.stock": { $lt: LOW_STOCK_THRESHOLD },
    }).sort({ "inventory.stock": 1 });

    res.json({ data: lowStockProducts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get inventory summary
export async function getInventorySummary(req, res) {
  try {
    const total = await Product.countDocuments();
    const lowStock = await Product.countDocuments({
      "inventory.stock": { $lt: LOW_STOCK_THRESHOLD },
    });
    const outOfStock = await Product.countDocuments({
      "inventory.stock": 0,
    });
    const totalInventory = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$inventory.stock" },
          totalValue: {
            $sum: { $multiply: ["$price", "$inventory.stock"] },
          },
        },
      },
    ]);

    res.json({
      data: {
        totalProducts: total,
        lowStockCount: lowStock,
        outOfStockCount: outOfStock,
        lowStockThreshold: LOW_STOCK_THRESHOLD,
        totalInventory: totalInventory[0] || {
          totalQuantity: 0,
          totalValue: 0,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update product inventory
export async function updateProductInventory(req, res) {
  const { sku } = req.params;
  const { stock, warehouse } = req.body;

  try {
    const updated = await Product.findOneAndUpdate(
      { sku },
      {
        "inventory.stock": stock,
        "inventory.warehouse": warehouse || "WH-1",
        "inventory.lastUpdated": new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json({ data: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get order summary/dashboard
export async function getOrderSummary(req, res) {
  try {
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ delivered: true });
    const pendingOrders = await Order.countDocuments({ delivered: false });

    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    res.json({
      data: {
        totalOrders,
        deliveredOrders,
        pendingOrders,
        ordersByStatus,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
