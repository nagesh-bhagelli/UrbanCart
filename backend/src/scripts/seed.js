import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Product from "../models/Product.js";
import User from "../models/User.js";
import { faker } from "@faker-js/faker";

const MONGO_URI = process.env.MONGO_URI;
const SEED_RUN_ID = "seed_products_v2_20_real_images";

async function seed() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  console.log("Clearing old data...");
  try {
    await db.collection("products").drop();
  } catch (e) { }
  try {
    await db.collection("users").drop();
  } catch (e) { }
  try {
    await db.collection("seeds_meta").drop();
  } catch (e) { }

  const products = [
    // Electronics (5)
    {
      sku: "ELEC-001",
      name: "Sony WH-1000XM5 Wireless Headphones",
      category: "Electronics",
      brand: "Sony",
      price: 29990.00,
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop",
      desc: "Industry-leading noise cancellation, exceptional sound quality, and crystal-clear hands-free calling.",
      stock: 45,
    },
    {
      sku: "ELEC-002",
      name: "Apple MacBook Air M2",
      category: "Electronics",
      brand: "Apple",
      price: 99900.00,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
      desc: "Supercharged by M2 chip. 13.6-inch Liquid Retina display, 1080p FaceTime HD camera.",
      stock: 20,
    },
    {
      sku: "ELEC-003",
      name: "Canon EOS R6 Mirrorless Camera",
      category: "Electronics",
      brand: "Canon",
      price: 215000.00,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
      desc: "Full-frame mirrorless camera with 20 fps, 4K60 video, and advanced subject tracking.",
      stock: 12,
    },
    {
      sku: "ELEC-004",
      name: "Logitech MX Master 3S Mouse",
      category: "Electronics",
      brand: "Logitech",
      price: 9495.00,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop",
      desc: "Performance wireless mouse with ultra-fast scrolling and 8K DPI tracking.",
      stock: 85,
    },
    {
      sku: "ELEC-005",
      name: "PlayStation 5 Console",
      category: "Electronics",
      brand: "Sony",
      price: 54990.00,
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1000&auto=format&fit=crop",
      desc: "Experience lightning-fast loading with an ultra-high-speed SSD and deeper immersion with haptic feedback.",
      stock: 8,
    },

    // Fashion (5)
    {
      sku: "FASH-001",
      name: "Nike Air Force 1 '07",
      category: "Fashion",
      brand: "Nike",
      price: 8995.00,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
      desc: "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best.",
      stock: 150,
    },
    {
      sku: "FASH-002",
      name: "Levi's Men's 501 Original Fit Jeans",
      category: "Fashion",
      brand: "Levi's",
      price: 3999.00,
      image: "https://images.unsplash.com/photo-1542272617-08f086303542?q=80&w=1000&auto=format&fit=crop",
      desc: "The original blue jean since 1873. Original straight fit style.",
      stock: 200,
    },
    {
      sku: "FASH-003",
      name: "Ray-Ban Aviator Classic Sunglasses",
      category: "Fashion",
      brand: "Ray-Ban",
      price: 9890.00,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop",
      desc: "Currently one of the most iconic sunglass models in the world.",
      stock: 45,
    },
    {
      sku: "FASH-004",
      name: "Adidas Originals Men's Hoodie",
      category: "Fashion",
      brand: "Adidas",
      price: 4999.00,
      image: "https://images.unsplash.com/photo-1556906781-9a412961d289?q=80&w=1000&auto=format&fit=crop",
      desc: "Classic Trefoil hoodie made of soft French terry for everyday comfort.",
      stock: 75,
    },
    {
      sku: "FASH-005",
      name: "Herschel Little America Backpack",
      category: "Fashion",
      brand: "Herschel",
      price: 8500.00,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
      desc: "A popular mountaineering silhouette, the Little America backpack elevates an iconic style with modern functionality.",
      stock: 30,
    },

    // Home (5)
    {
      sku: "HOME-001",
      name: "Dyson V15 Detect Vacuum",
      category: "Home",
      brand: "Dyson",
      price: 55900.00,
      image: "https://images.unsplash.com/photo-1558317374-a35498f3cc6a?q=80&w=1000&auto=format&fit=crop",
      desc: "Dyson's most powerful, intelligent cordless vacuum. Laser reveals microscopic dust.",
      stock: 25,
    },
    {
      sku: "HOME-002",
      name: "Nespresso Vertuo Coffee Maker",
      category: "Home",
      brand: "Nespresso",
      price: 22500.00,
      image: "https://images.unsplash.com/photo-1517088196657-3932e6504620?q=80&w=1000&auto=format&fit=crop",
      desc: "Single-serve coffee and machine. Brews 4 cup sizes.",
      stock: 40,
    },
    {
      sku: "HOME-003",
      name: "Herman Miller Aeron Chair",
      category: "Home",
      brand: "Herman Miller",
      price: 145000.00,
      image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop",
      desc: "Ergonomic office chair with breathable pellicle suspension.",
      stock: 10,
    },
    {
      sku: "HOME-004",
      name: "Philips Hue White & Color Ambiance",
      category: "Home",
      brand: "Philips",
      price: 4500.00,
      image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop",
      desc: "Smart LED bulbs that let you play with light and choose from 16 million colors.",
      stock: 120,
    },
    {
      sku: "HOME-005",
      name: "Yeti Rambler 20 oz Tumbler",
      category: "Home",
      brand: "Yeti",
      price: 3200.00,
      image: "https://images.unsplash.com/photo-1596464522434-5853f0fa734b?q=80&w=1000&auto=format&fit=crop",
      desc: "Kitchen-grade stainless steel with double-wall vacuum insulation.",
      stock: 200,
    },

    // Beauty (5)
    {
      sku: "BEAUTY-001",
      name: "La Mer Crème de la Mer",
      category: "Beauty",
      brand: "La Mer",
      price: 32500.00,
      image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop",
      desc: "Ultra-rich cream that delivers soothing moisture and healing.",
      stock: 15,
    },
    {
      sku: "BEAUTY-002",
      name: "Dior Sauvage Eau de Toilette",
      category: "Beauty",
      brand: "Dior",
      price: 9500.00,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
      desc: "A radically fresh composition, dictated by a name that has the ring of a manifesto.",
      stock: 60,
    },
    {
      sku: "BEAUTY-003",
      name: "Aesop Resurrection Aromatique Hand Balm",
      category: "Beauty",
      brand: "Aesop",
      price: 2700.00,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
      desc: "A blend of fragrant botanicals and skin-softening emollients.",
      stock: 90,
    },
    {
      sku: "BEAUTY-004",
      name: "Dyson Airwrap Multi-Styler",
      category: "Beauty",
      brand: "Dyson",
      price: 45900.00,
      image: "https://images.unsplash.com/photo-1624898166898-d42127276707?q=80&w=1000&auto=format&fit=crop",
      desc: "Curl, shape, smooth, and hide flyaways with no extreme heat.",
      stock: 10,
    },
    {
      sku: "BEAUTY-005",
      name: "Chanel N°5 Eau de Parfum",
      category: "Beauty",
      brand: "Chanel",
      price: 13500.00,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
      desc: "A timeless, legendary fragrance.",
      stock: 25,
    },
  ];

  console.log(`Inserting ${products.length} products...`);

  const formattedProducts = products.map(p => ({
    sku: p.sku,
    name: p.name,
    category: p.category,
    brand: p.brand,
    image: p.image,
    price: p.price,
    inventory: {
      stock: p.stock,
      warehouse: "WH-1",
      lastUpdated: new Date()
    },
    specifications: { desc: p.desc },
    attributes: {},
    reviews: []
  }));

  await Product.insertMany(formattedProducts, { ordered: false });

  // Create admin user
  const adminUser = {
    username: "admin",
    email: "admin@urbancart.com",
    password: "admin123456",
    role: "admin",
  };

  const users = [adminUser];
  for (let i = 0; i < 5; i++) {
    users.push({
      username: `user${i}`,
      email: `user${i}@example.com`,
      password: "user123456",
      role: "user",
    });
  }
  await User.insertMany(users, { ordered: false });

  console.log("Seeding finished.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding error", err);
  process.exit(1);
});
