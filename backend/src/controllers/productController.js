import Product from "../models/Product.js";

export async function listProducts(req, res) {
  const { page = 1, limit = 20, category, brand, q } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const filter = {};
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (q) filter.$text = { $search: q }; // optional if you add text index
  const products = await Product.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .lean();
  res.json({ data: products });
}

export async function getProduct(req, res) {
  const { sku } = req.params;
  const product = await Product.findOne({ sku }).lean();
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json({ data: product });
}

export async function createProduct(req, res) {
  const body = req.body;
  try {
    const p = await Product.create(body);
    res.status(201).json({ data: p });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateProduct(req, res) {
  const { sku } = req.params;
  try {
    const updated = await Product.findOneAndUpdate({ sku }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ data: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteProduct(req, res) {
  const { sku } = req.params;
  const r = await Product.findOneAndDelete({ sku });
  if (!r) return res.status(404).json({ error: "Not found" });
  res.json({ data: r });
}
