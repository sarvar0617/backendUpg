import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import { productSlug, slugify } from "../utils/slug.js";

const productSelect = {
  id: true,
  name: true,
  slug: true,
  sku: true,
  description: true,
  price: true,
  oldPrice: true,
  stock: true,
  image: true,
  isNew: true,
  isFeatured: true,
  category: { select: { id: true, name: true, slug: true, image: true } },
  brand: { select: { id: true, name: true, slug: true, logo: true } },
};

export const importProducts = async (products) => {
  const prepared = products.map((product) => ({
    ...product,
    categorySlug: slugify(product.category),
    brandSlug: slugify(product.brand),
    slug: productSlug(product.name, product.sku),
  }));

  return prisma.$transaction(async (tx) => {
    const existingProducts = await tx.product.findMany({
      where: {
        OR: [
          { sku: { in: prepared.map(({ sku }) => sku) } },
          { slug: { in: prepared.map(({ slug }) => slug) } },
        ],
      },
      select: { sku: true, slug: true },
    });
    const existingBySku = new Map(existingProducts.map((product) => [product.sku, product]));

    for (const product of prepared) {
      const existing = existingProducts.find(({ slug }) => slug === product.slug);
      if (existing && existing.sku !== product.sku) {
        throw new AppError(`Product slug "${product.slug}" is already used by another SKU`, 409);
      }
      const existingForSku = existingBySku.get(product.sku);
      if (existingForSku && existingForSku.slug !== product.slug) {
        const slugOwner = existingProducts.find(({ slug }) => slug === product.slug);
        if (slugOwner && slugOwner.sku !== product.sku) {
          throw new AppError(`Product slug "${product.slug}" is already used by another SKU`, 409);
        }
      }
    }

    const results = [];
    for (const product of prepared) {
      const category = await tx.category.upsert({
        where: { slug: product.categorySlug },
        update: { name: product.category },
        create: { name: product.category, slug: product.categorySlug },
      });
      const brand = await tx.brand.upsert({
        where: { slug: product.brandSlug },
        update: { name: product.brand },
        create: { name: product.brand, slug: product.brandSlug },
      });
      const data = {
        name: product.name,
        slug: product.slug,
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
      results.push(await tx.product.upsert({
        where: { sku: product.sku },
        update: data,
        create: data,
        select: productSelect,
      }));
    }

    return results;
  });
};
