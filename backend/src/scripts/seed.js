import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Product from "../models/Product.js";
import User from "../models/User.js";
import { faker } from "@faker-js/faker";

const MONGO_URI = process.env.MONGO_URI;
const SEED_RUN_ID = process.env.SEED_RUN_ID || "initial_seed_v1";

async function seed() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  // Always clear collections to start fresh
  console.log("Clearing old data...");
  try {
    await db.collection("products").drop();
  } catch (e) {
    // Collection doesn't exist, that's fine
  }
  try {
    await db.collection("users").drop();
  } catch (e) {
    // Collection doesn't exist, that's fine
  }

  const metaCol = db.collection("seeds_meta");
  try {
    await metaCol.deleteOne({ name: SEED_RUN_ID });
  } catch (e) {
    // Metadata doesn't exist, that's fine
  }

  const productData = [
    // Electronics
    {
      sku: "PRD-000001",
      name: "Sony WH-1000XM5 Wireless Headphones",
      category: "Electronics",
      brand: "Sony",
      price: 349.99,
      desc: "Premium noise-cancelling wireless headphones with 30-hour battery life and superior audio quality.",
      stock: 45,
    },
    {
      sku: "PRD-000002",
      name: "Apple iPhone 15 Pro Max 256GB",
      category: "Electronics",
      brand: "Apple",
      price: 1199,
      desc: "Latest iPhone with advanced camera system, A17 Pro chip, and stunning 6.7-inch display.",
      stock: 28,
    },
    {
      sku: "PRD-000003",
      name: "Samsung 65-inch QLED 4K TV",
      category: "Electronics",
      brand: "Samsung",
      price: 1299,
      desc: "Immersive 4K QLED display with quantum dots, 120Hz refresh rate, and smart TV features.",
      stock: 12,
    },
    {
      sku: "PRD-000004",
      name: "Dell XPS 13 Laptop i7 16GB RAM",
      category: "Electronics",
      brand: "Dell",
      price: 1299,
      desc: "Ultra-portable laptop with InfinityEdge display, 13th gen Intel i7, perfect for professionals.",
      stock: 34,
    },
    {
      sku: "PRD-000005",
      name: "iPad Air 11-inch M2 Chip 256GB",
      category: "Electronics",
      brand: "Apple",
      price: 799,
      desc: "Powerful tablet with M2 chip, stunning Liquid Retina display, and Apple Pencil support.",
      stock: 52,
    },
    {
      sku: "PRD-000006",
      name: "GoPro Hero 12 Black Action Camera",
      category: "Electronics",
      brand: "GoPro",
      price: 499.99,
      desc: "Professional action camera with 5.3K video, excellent stabilization, and waterproof design.",
      stock: 38,
    },
    {
      sku: "PRD-000007",
      name: "Anker PowerCore 26800mAh Power Bank",
      category: "Electronics",
      brand: "Anker",
      price: 39.99,
      desc: "High-capacity fast charging power bank with dual USB-C ports and LED display.",
      stock: 120,
    },
    {
      sku: "PRD-000008",
      name: "Canon EOS R8 Mirrorless Camera",
      category: "Electronics",
      brand: "Canon",
      price: 1499,
      desc: "Professional-grade mirrorless camera with full-frame sensor and 4K video capabilities.",
      stock: 18,
    },
    {
      sku: "PRD-000009",
      name: "DJI Air 3S Drone with 48MP Camera",
      category: "Electronics",
      brand: "DJI",
      price: 999,
      desc: "Advanced drone with dual cameras, 46-minute flight time, and intelligent flight modes.",
      stock: 22,
    },
    {
      sku: "PRD-000010",
      name: "Oculus Meta Quest 3 256GB VR Headset",
      category: "Electronics",
      brand: "Meta",
      price: 649,
      desc: "Next-gen VR headset with stunning graphics, comfortable fit, and extensive game library.",
      stock: 41,
    },

    // Home & Kitchen
    {
      sku: "PRD-000011",
      name: "Dyson V15 Detect Cordless Vacuum",
      category: "Home",
      brand: "Dyson",
      price: 749.99,
      desc: "Powerful cordless vacuum with laser dust detection, 60-minute runtime, and HEPA filter.",
      stock: 15,
    },
    {
      sku: "PRD-000012",
      name: "Instant Pot Duo Plus 9-in-1 Cooker",
      category: "Home",
      brand: "Instant Pot",
      price: 149.99,
      desc: "Multi-use pressure cooker combining 9 kitchen appliances in one smart device.",
      stock: 67,
    },
    {
      sku: "PRD-000013",
      name: "KitchenAid Artisan Stand Mixer Red",
      category: "Home",
      brand: "KitchenAid",
      price: 329.99,
      desc: "Premium stand mixer with 5-quart stainless steel bowl and 10-speed motor.",
      stock: 29,
    },
    {
      sku: "PRD-000014",
      name: "Nespresso VertuoPlus Deluxe Coffee Machine",
      category: "Home",
      brand: "Nespresso",
      price: 299.99,
      desc: "Automatic coffee machine with centrifusion technology for premium espresso and coffee.",
      stock: 35,
    },
    {
      sku: "PRD-000015",
      name: "Philips 4000 Series Air Fryer",
      category: "Home",
      brand: "Philips",
      price: 299.99,
      desc: "Large 6.2L air fryer with smart sensing technology and rapid air circulation.",
      stock: 48,
    },
    {
      sku: "PRD-000016",
      name: "Samsung 4-Door French Door Refrigerator",
      category: "Home",
      brand: "Samsung",
      price: 2299,
      desc: "Smart refrigerator with flexible temperature zones and water/ice dispensers.",
      stock: 8,
    },
    {
      sku: "PRD-000017",
      name: "Shark Navigator Upright Vacuum Cleaner",
      category: "Home",
      brand: "Shark",
      price: 399.99,
      desc: "Lightweight upright vacuum with anti-allergen complete seal and lift-away design.",
      stock: 54,
    },
    {
      sku: "PRD-000018",
      name: "Lego Classic Large Creative Brick Box",
      category: "Home",
      brand: "Lego",
      price: 99.99,
      desc: "1500-piece creative brick set including special bricks and 8 mini builds.",
      stock: 76,
    },
    {
      sku: "PRD-000019",
      name: "Lumens Light Smart RGB Bulbs 4-Pack",
      category: "Home",
      brand: "Lumens",
      price: 79.99,
      desc: "Smart WiFi LED bulbs with 16 million colors and voice control compatibility.",
      stock: 91,
    },
    {
      sku: "PRD-000020",
      name: "Dyson Lightcycle Task Light",
      category: "Home",
      brand: "Dyson",
      price: 599,
      desc: "Advanced desk lamp with UV purification and automatically adjusts lighting throughout day.",
      stock: 19,
    },

    // Fashion & Clothing
    {
      sku: "PRD-000021",
      name: "Nike Air Jordan 1 Retro High OG Chicago",
      category: "Clothing",
      brand: "Nike",
      price: 170,
      desc: "Iconic sneaker featuring premium leather, Air cushioning, and classic Chicago colorway.",
      stock: 82,
    },
    {
      sku: "PRD-000022",
      name: "Levi's 501 Original Fit Jeans Blue",
      category: "Clothing",
      brand: "Levi's",
      price: 98,
      desc: "Classic 5-pocket jeans made from durable denim with authentic vintage feel.",
      stock: 124,
    },
    {
      sku: "PRD-000023",
      name: "The North Face Thermoball Jacket",
      category: "Clothing",
      brand: "The North Face",
      price: 199.95,
      desc: "Lightweight down-like insulated jacket perfect for winter adventures.",
      stock: 56,
    },
    {
      sku: "PRD-000024",
      name: "Columbia Omni-Tech Waterproof Rain Jacket",
      category: "Clothing",
      brand: "Columbia",
      price: 159.99,
      desc: "Advanced waterproof technology keeps you dry in heavy rain with breathable comfort.",
      stock: 68,
    },
    {
      sku: "PRD-000025",
      name: "Adidas Ultraboost 22 Running Shoes",
      category: "Clothing",
      brand: "Adidas",
      price: 180,
      desc: "Premium running shoe with responsive Boost cushioning and sustainable materials.",
      stock: 95,
    },
    {
      sku: "PRD-000026",
      name: "Puma RS-X Sneakers White",
      category: "Clothing",
      brand: "Puma",
      price: 120,
      desc: "Retro-inspired sneaker with modern comfort technology and bold design.",
      stock: 73,
    },
    {
      sku: "PRD-000027",
      name: "Tommy Hilfiger Classic Polo Shirt",
      category: "Clothing",
      brand: "Tommy Hilfiger",
      price: 79.99,
      desc: "Timeless polo shirt with signature embroidery and comfortable cotton blend.",
      stock: 103,
    },
    {
      sku: "PRD-000028",
      name: "Ralph Lauren Premium Cotton Sweater",
      category: "Clothing",
      brand: "Ralph Lauren",
      price: 145,
      desc: "Luxurious merino wool blend sweater perfect for casual and formal wear.",
      stock: 47,
    },
    {
      sku: "PRD-000029",
      name: "Gucci Marmont Leather Handbag",
      category: "Clothing",
      brand: "Gucci",
      price: 1890,
      desc: "Iconic luxury handbag with distinctive GG logo and premium leather construction.",
      stock: 6,
    },
    {
      sku: "PRD-000030",
      name: "Michael Kors Jet Set Travel Tote",
      category: "Clothing",
      brand: "Michael Kors",
      price: 298,
      desc: "Spacious designer tote with signature MK logo and multiple compartments.",
      stock: 38,
    },

    // Sports & Outdoors
    {
      sku: "PRD-000031",
      name: "Yeti Rambler 26 oz Tumbler Stainless",
      category: "Sports",
      brand: "Yeti",
      price: 44.95,
      desc: "Premium insulated tumbler keeps drinks hot for 24 hours or cold for 48 hours.",
      stock: 138,
    },
    {
      sku: "PRD-000032",
      name: "Coleman 8-Person Camping Tent",
      category: "Sports",
      brand: "Coleman",
      price: 199.99,
      desc: "Spacious camping tent with WeatherTec technology and dark room interior.",
      stock: 24,
    },
    {
      sku: "PRD-000033",
      name: "Wilson Pro Staff Tennis Racket",
      category: "Sports",
      brand: "Wilson",
      price: 189.99,
      desc: "Professional-grade tennis racket with responsive frame and superior control.",
      stock: 31,
    },
    {
      sku: "PRD-000034",
      name: "Spalding Official NBA Basketball",
      category: "Sports",
      brand: "Spalding",
      price: 59.99,
      desc: "Official NBA regulation basketball with premium indoor/outdoor composite leather.",
      stock: 87,
    },
    {
      sku: "PRD-000035",
      name: "Strava GPS Running Watch Elite",
      category: "Sports",
      brand: "Strava",
      price: 299.99,
      desc: "Advanced sports watch with GPS tracking, heart rate monitor, and training features.",
      stock: 42,
    },
    {
      sku: "PRD-000036",
      name: "Trek Dual Sport 700c Hybrid Bicycle",
      category: "Sports",
      brand: "Trek",
      price: 599,
      desc: "Versatile hybrid bike combining road and mountain bike features for any terrain.",
      stock: 14,
    },
    {
      sku: "PRD-000037",
      name: "Hydro Flask 40oz Wide-Mouth Bottle",
      category: "Sports",
      brand: "Hydro Flask",
      price: 64.95,
      desc: "Ultra-durable insulated bottle keeps beverages at desired temperature for hours.",
      stock: 156,
    },
    {
      sku: "PRD-000038",
      name: "Under Armour Hovr Sonic 6 Running Shoes",
      category: "Sports",
      brand: "Under Armour",
      price: 139.99,
      desc: "Lightweight running shoe with responsive cushioning and breathable mesh upper.",
      stock: 69,
    },
    {
      sku: "PRD-000039",
      name: "GoPro Protective Equipment Bundle",
      category: "Sports",
      brand: "GoPro",
      price: 79.99,
      desc: "Complete set of mounts, cases, and accessories for action camera recording.",
      stock: 58,
    },
    {
      sku: "PRD-000040",
      name: "Garmin fenix 7X GPS Smartwatch",
      category: "Sports",
      brand: "Garmin",
      price: 699,
      desc: "Premium multisport GPS watch with satellite navigation and advanced training metrics.",
      stock: 21,
    },

    // Books & Media
    {
      sku: "PRD-000041",
      name: "The Psychology of Money Hardcover",
      category: "Electronics",
      brand: "Penguin",
      price: 28,
      desc: "Best-selling book about behavior and emotions related to money management.",
      stock: 112,
    },
    {
      sku: "PRD-000042",
      name: "Dune Part Two Blu-ray 4K Ultra HD",
      category: "Electronics",
      brand: "Warner Bros",
      price: 39.99,
      desc: "Epic sci-fi film on 4K Blu-ray with stunning visuals and immersive sound.",
      stock: 44,
    },
    {
      sku: "PRD-000043",
      name: "Atomic Habits Paperback Best Seller",
      category: "Electronics",
      brand: "Penguin",
      price: 18,
      desc: "Practical guide to building good habits and breaking bad ones scientifically.",
      stock: 89,
    },
    {
      sku: "PRD-000044",
      name: "The Midnight Library Audiobook",
      category: "Electronics",
      brand: "Audible",
      price: 24.99,
      desc: "Immersive fantasy audiobook narrated by beautifully performed story.",
      stock: 62,
    },
    {
      sku: "PRD-000045",
      name: "Calculus Advanced Textbook Bundle",
      category: "Electronics",
      brand: "Pearson",
      price: 189.99,
      desc: "Comprehensive calculus textbook with online resources and practice problems.",
      stock: 27,
    },
    {
      sku: "PRD-000046",
      name: "Gaming Mouse Pad RGB LED 31x11 inch",
      category: "Electronics",
      brand: "HyperX",
      price: 49.99,
      desc: "Large gaming surface with RGB lighting, precise tracking, and non-slip base.",
      stock: 76,
    },
    {
      sku: "PRD-000047",
      name: "Mechanical Gaming Keyboard RGB",
      category: "Electronics",
      brand: "Corsair",
      price: 179.99,
      desc: "Premium mechanical keyboard with RGB backlighting and programmable keys.",
      stock: 54,
    },
    {
      sku: "PRD-000048",
      name: "4K Webcam Professional 60fps",
      category: "Electronics",
      brand: "Logitech",
      price: 249.99,
      desc: "Crystal clear 4K streaming camera perfect for content creators and streamers.",
      stock: 33,
    },
    {
      sku: "PRD-000049",
      name: "USB-C Hub 7-in-1 Multiport Adapter",
      category: "Electronics",
      brand: "Anker",
      price: 49.99,
      desc: "Portable hub with HDMI, USB, SD reader, and power delivery support.",
      stock: 98,
    },
    {
      sku: "PRD-000050",
      name: "Wireless Gaming Mouse Pro",
      category: "Electronics",
      brand: "Razer",
      price: 69.99,
      desc: "High-precision wireless mouse with 650 hour battery life and customizable buttons.",
      stock: 81,
    },
  ];

  const products = [];
  for (let i = 0; i < productData.length; i++) {
    const item = productData[i];
    const p = {
      sku: item.sku,
      name: item.name,
      category: item.category,
      brand: item.brand,
      price: item.price,
      inventory: {
        stock: item.stock,
        warehouse: "WH-1",
        lastUpdated: new Date(),
      },
      specifications: { desc: item.desc },
      attributes:
        item.category === "Clothing" ? { size: ["S", "M", "L", "XL"] } : {},
      reviews: Array.from({ length: Math.floor(Math.random() * 5) }).map(
        () => ({
          userId: new mongoose.Types.ObjectId(),
          rating: 3 + Math.floor(Math.random() * 3),
          text: faker.lorem.sentence(),
          date: new Date(),
        })
      ),
    };
    products.push(p);
  }

  console.log(`Inserting ${products.length} products...`);
  await Product.insertMany(products, { ordered: false });

  // Create admin user
  const adminUser = {
    username: "admin",
    email: "admin@urbancart.com",
    password: "admin123456", // Will be hashed by auth controller
    role: "admin",
  };

  const users = [adminUser];
  for (let i = 0; i < 100; i++) {
    users.push({
      username: `user${i}`,
      email: `user${i}@example.com`,
      password: "user123456",
      role: "user",
    });
  }
  await User.insertMany(users, { ordered: false });

  await metaCol.insertOne({ name: SEED_RUN_ID, createdAt: new Date() });
  console.log("Seeding finished.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding error", err);
  process.exit(1);
});
