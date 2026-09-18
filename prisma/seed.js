import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the seed.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Keyboards", slug: "keyboards" },
  { name: "Mice", slug: "mice" },
  { name: "Microphones", slug: "microphones" },
  { name: "Headphones", slug: "headphones" },
  { name: "Monitors", slug: "monitors" },
  { name: "Monitor Arms", slug: "monitor-arms" },
  { name: "Game Consoles", slug: "game-consoles" },
  { name: "Controllers", slug: "controllers" },
  { name: "Wi-Fi Adapters", slug: "wifi-adapters" },
  { name: "PC Cases", slug: "pc-cases" },
  { name: "Gaming Tables", slug: "gaming-tables" },
  { name: "Lighting", slug: "lighting" },
];

const brands = [
  { name: "Logitech", slug: "logitech" },
  { name: "Razer", slug: "razer" },
  { name: "HyperX", slug: "hyperx" },
  { name: "Samsung", slug: "samsung" },
  { name: "ASUS", slug: "asus" },
  { name: "Sony", slug: "sony" },
  { name: "TP-Link", slug: "tp-link" },
  { name: "NZXT", slug: "nzxt" },
  { name: "Secretlab", slug: "secretlab" },
  { name: "Philips", slug: "philips" },
  { name: "Corsair", slug: "corsair" },
];

const products = [
  {
    name: "Logitech G Pro X TKL Lightspeed",
    slug: "logitech-g-pro-x-tkl-lightspeed",
    sku: "UPG-KB-LOG-GPRO-TKL",
    description: "Wireless tenkeyless gaming keyboard with low-latency Lightspeed connectivity.",
    price: 1899000,
    oldPrice: 2199000,
    stock: 18,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=80",
    isNew: true,
    isFeatured: true,
    categorySlug: "keyboards",
    brandSlug: "logitech",
  },
  {
    name: "Razer DeathAdder V3 Pro",
    slug: "razer-deathadder-v3-pro",
    sku: "UPG-MS-RAZ-DA-V3P",
    description: "Lightweight wireless ergonomic gaming mouse with a high-precision optical sensor.",
    price: 1499000,
    oldPrice: 1699000,
    stock: 24,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
    categorySlug: "mice",
    brandSlug: "razer",
  },
  {
    name: "HyperX QuadCast S",
    slug: "hyperx-quadcast-s",
    sku: "UPG-MIC-HYX-QCAST-S",
    description: "USB condenser microphone with RGB lighting and built-in shock mount.",
    price: 1699000,
    stock: 11,
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80",
    isNew: true,
    categorySlug: "microphones",
    brandSlug: "hyperx",
  },
  {
    name: "Sony INZONE H9",
    slug: "sony-inzone-h9",
    sku: "UPG-HP-SON-INZONE-H9",
    description: "Wireless noise-cancelling gaming headset with spatial audio.",
    price: 2799000,
    oldPrice: 3199000,
    stock: 9,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
    categorySlug: "headphones",
    brandSlug: "sony",
  },
  {
    name: "ASUS ROG Swift PG27AQDM",
    slug: "asus-rog-swift-pg27aqdm",
    sku: "UPG-MON-ASU-PG27AQDM",
    description: "27-inch QHD OLED gaming monitor with a 240Hz refresh rate.",
    price: 8999000,
    oldPrice: 9799000,
    stock: 6,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    isNew: true,
    isFeatured: true,
    categorySlug: "monitors",
    brandSlug: "asus",
  },
  {
    name: "Samsung Odyssey G5 32-inch",
    slug: "samsung-odyssey-g5-32",
    sku: "UPG-MON-SAM-G5-32",
    description: "Curved QHD gaming monitor with a 165Hz refresh rate and 1ms response time.",
    price: 4499000,
    stock: 13,
    image: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=900&q=80",
    categorySlug: "monitors",
    brandSlug: "samsung",
  },
  {
    name: "Sony PlayStation 5 Slim",
    slug: "sony-playstation-5-slim",
    sku: "UPG-CON-SON-PS5-SLIM",
    description: "Compact PlayStation 5 console with fast SSD storage and immersive gaming features.",
    price: 7499000,
    stock: 5,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
    categorySlug: "game-consoles",
    brandSlug: "sony",
  },
  {
    name: "Razer Wolverine V2 Chroma",
    slug: "razer-wolverine-v2-chroma",
    sku: "UPG-CTRL-RAZ-WV2C",
    description: "Wired Xbox controller with remappable buttons and Chroma RGB lighting.",
    price: 1399000,
    stock: 17,
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=900&q=80",
    categorySlug: "controllers",
    brandSlug: "razer",
  },
  {
    name: "TP-Link Archer TXE75E",
    slug: "tp-link-archer-txe75e",
    sku: "UPG-WIFI-TPL-TXE75E",
    description: "Wi-Fi 6E PCIe adapter with Bluetooth 5.3 for fast desktop connectivity.",
    price: 699000,
    stock: 21,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    categorySlug: "wifi-adapters",
    brandSlug: "tp-link",
  },
  {
    name: "NZXT H9 Flow",
    slug: "nzxt-h9-flow",
    sku: "UPG-CASE-NZX-H9FLOW",
    description: "Dual-chamber ATX PC case with panoramic tempered-glass panels and high airflow.",
    price: 2199000,
    stock: 8,
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=80",
    isNew: true,
    categorySlug: "pc-cases",
    brandSlug: "nzxt",
  },
];

async function main() {
  const categoryRecords = new Map();
  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
    categoryRecords.set(record.slug, record);
  }

  const brandRecords = new Map();
  for (const brand of brands) {
    const record = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name },
      create: brand,
    });
    brandRecords.set(record.slug, record);
  }

  for (const product of products) {
    const { categorySlug, brandSlug, ...productData } = product;
    const category = categoryRecords.get(categorySlug);
    const brand = brandRecords.get(brandSlug);

    if (!category || !brand) {
      throw new Error(`Missing relation for product ${product.slug}`);
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...productData,
        categoryId: category.id,
        brandId: brand.id,
      },
      create: {
        ...productData,
        category: { connect: { id: category.id } },
        brand: { connect: { id: brand.id } },
      },
    });
  }

  console.log(`Seeded ${categories.length} categories, ${brands.length} brands, and ${products.length} products.`);

  const legacyCatalogPath = fileURLToPath(new URL("../data/catalog.json", import.meta.url));
  const legacyCatalog = JSON.parse(await readFile(legacyCatalogPath, "utf8"));
  const legacyProducts = [...legacyCatalog.newProducts, ...legacyCatalog.bestOffers];

  const slugify = (value) => value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const legacyCategory = await prisma.category.upsert({
    where: { slug: "legacy-catalog" },
    update: { name: "Legacy catalog" },
    create: { name: "Legacy catalog", slug: "legacy-catalog" },
  });

  for (const legacyProduct of legacyProducts) {
    const brandSlug = slugify(legacyProduct.brand) || "unknown";
    const brand = await prisma.brand.upsert({
      where: { slug: brandSlug },
      update: { name: legacyProduct.brand },
      create: { name: legacyProduct.brand, slug: brandSlug },
    });
    const slug = `${legacyProduct.id}-${slugify(legacyProduct.title)}`;
    const data = {
      name: legacyProduct.title,
      slug,
      sku: `LEGACY-${legacyProduct.id}`,
      price: legacyProduct.price,
      stock: 10,
      image: legacyProduct.image,
      isNew: legacyCatalog.newProducts.some((item) => item.id === legacyProduct.id),
      isFeatured: legacyCatalog.bestOffers.some((item) => item.id === legacyProduct.id),
      categoryId: legacyCategory.id,
      brandId: brand.id,
    };
    await prisma.product.upsert({ where: { sku: data.sku }, update: data, create: data });
  }

  console.log(`Migrated ${legacyProducts.length} products from data/catalog.json.`);
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
