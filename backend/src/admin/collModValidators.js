import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function run() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  try {
    const cmd = {
      collMod: "products",
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["sku", "name", "price", "inventory"],
          properties: {
            sku: { bsonType: "string" },
            name: { bsonType: "string" },
            price: { bsonType: "double", minimum: 0.0 },
            "inventory.stock": {
              bsonType: ["int", "long", "double"],
              minimum: 0,
            },
          },
        },
      },
      validationLevel: "strict",
    };
    await db.command(cmd).catch(async (e) => {
      // collection may not exist -> create then apply
      if (e.codeName === "NamespaceNotFound") {
        await db.createCollection("products");
        return db.command(cmd);
      }
      throw e;
    });
    console.log("Validator applied to products collection");
  } finally {
    process.exit(0);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
