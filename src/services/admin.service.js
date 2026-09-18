import { prisma } from "../lib/prisma.js";

const slugify = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

export const importProducts = async (products) => {
  const results = [];

  for (const product of products) {
    const categorySlug = slugify(product.category);
    const brandSlug = slugify(product.brand);
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: { name: product.category },
      create: { name: product.category, slug: categorySlug },
    });
    const brand = await prisma.brand.upsert({
      where: { slug: brandSlug },
      update: { name: product.brand },
      create: { name: product.brand, slug: brandSlug },
    });
    const slug = `${slugify(product.name)}-${slugify(product.sku)}`;
    const data = {
      name: product.name,
      slug,
      sku: product.sku,
      price: product.price,
      oldPrice: product.oldPrice ?? null,
      stock: product.stock ?? 0,
      image: product.image ?? null,
      description: product.description ?? null,
      isNew: product.isNew ?? false,
      isFeatured: product.isFeatured ?? false,
      categoryId: category.id,
      brandId: brand.id,
    };
    const saved = await prisma.product.upsert({
      where: { sku: product.sku },
      update: data,
      create: data,
    });
    results.push(saved);
  }

  return results;
};
