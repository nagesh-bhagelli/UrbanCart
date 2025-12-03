import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export async function placeOrderAtomic(orderPayload) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // validate and decrement
    for (const item of orderPayload.items) {
      const res = await Product.findOneAndUpdate(
        { sku: item.sku, "inventory.stock": { $gte: item.qty } },
        {
          $inc: { "inventory.stock": -item.qty },
          $set: { "inventory.lastUpdated": new Date() },
        },
        { session, new: true }
      );
      if (!res) {
        throw new Error(`Insufficient stock for SKU ${item.sku}`);
      }
      // populate priceAtOrder
      item.priceAtOrder = res.price;
    }

    // create order snapshot
    const total = orderPayload.items.reduce(
      (s, it) => s + it.qty * it.priceAtOrder,
      0
    );
    const orderDoc = { ...orderPayload, total };
    const [created] = await Order.create([orderDoc], { session });

    // optional: update user orders array
    if (orderPayload.userId) {
      await mongoose
        .model("User")
        .findByIdAndUpdate(
          orderPayload.userId,
          { $push: { orders: created._id } },
          { session }
        );
    }

    await session.commitTransaction();
    session.endSession();
    return created;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    // If transactions are not supported (standalone mongo), fall back to non-transactional flow
    if (
      err &&
      /Transaction numbers are only allowed|not a replica set|ReplicaSet|txn requires/gi.test(
        err.message
      )
    ) {
      // Non-transactional fallback
      for (const item of orderPayload.items) {
        const res = await Product.findOneAndUpdate(
          { sku: item.sku, "inventory.stock": { $gte: item.qty } },
          {
            $inc: { "inventory.stock": -item.qty },
            $set: { "inventory.lastUpdated": new Date() },
          },
          { new: true }
        );
        if (!res) {
          throw new Error(`Insufficient stock for SKU ${item.sku}`);
        }
        item.priceAtOrder = res.price;
      }

      const total = orderPayload.items.reduce(
        (s, it) => s + it.qty * it.priceAtOrder,
        0
      );
      const orderDoc = { ...orderPayload, total };
      const created = await Order.create(orderDoc);

      if (orderPayload.userId) {
        await mongoose
          .model("User")
          .findByIdAndUpdate(orderPayload.userId, {
            $push: { orders: created._id },
          });
      }

      return created;
    }
    throw err;
  }
}
