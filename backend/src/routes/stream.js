import express from "express";
import mongoose from "mongoose";
const router = express.Router();

router.get("/products/:sku", async (req, res) => {
  const { sku } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // Build pipeline: match updates for this SKU
    const pipeline = [{ $match: { "fullDocument.sku": sku } }];

    const coll = mongoose.connection.collection("products");
    const cs = coll.watch(pipeline, { fullDocument: "updateLookup" });

    cs.on("change", (change) => {
      // send the whole document (or select fields)
      const payload = change.fullDocument;
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    });

    cs.on("error", (error) => {
      console.error("Change stream error:", error.message);
      res.write(
        `data: ${JSON.stringify({ error: "Stream not available" })}\n\n`
      );
      res.end();
    });

    req.on("close", () => {
      cs.close();
      res.end();
    });
  } catch (error) {
    console.error("Stream endpoint error:", error.message);
    res.write(`data: ${JSON.stringify({ error: "Stream not available" })}\n\n`);
    res.end();
  }
});

export default router;
