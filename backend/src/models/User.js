import mongoose from "mongoose";
const { Schema } = mongoose;

const cartItem = new Schema(
  {
    sku: String,
    qty: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    cart: { type: [cartItem], default: [] },
    // orders are referenced; allow order history as refs
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
