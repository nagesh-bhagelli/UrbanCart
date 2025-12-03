import mongoose from "mongoose";
const { Schema } = mongoose;

const lineItem = new Schema(
  {
    sku: String,
    qty: Number,
    priceAtOrder: Number,
  },
  { _id: false }
);

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  items: { type: [lineItem], required: true },
  total: Number,
  status: {
    type: String,
    enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
    default: "placed",
  },
  delivered: { type: Boolean, default: false },
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
