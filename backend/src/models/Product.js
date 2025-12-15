import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: false },
    rating: { type: Number, min: 1, max: 5 },
    text: String,
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const inventorySchema = new Schema(
  {
    stock: { type: Number, required: true, min: 0 },
    warehouse: { type: String },
    lastUpdated: { type: Date, default: Date.now },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, index: true },
    brand: String,
    image: { type: String },
    price: { type: Number, min: 1, required: true },
    inventory: { type: inventorySchema, required: true },
    specifications: { type: Schema.Types.Mixed },
    attributes: { type: Schema.Types.Mixed }, // dynamic product attributes
    reviews: { type: [reviewSchema], default: [] },
  },
  { timestamps: true, versionKey: "__v" }
);

// enable optimistic concurrency via __v version key
productSchema.set("optimisticConcurrency", true);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
