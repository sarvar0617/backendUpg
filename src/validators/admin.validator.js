import { z } from "zod";
import { productSlug, slugify } from "../utils/slug.js";

const optionalString = z.string().trim().min(1).optional().nullable();

export const productImportSchema = z.object({
  products: z.array(z.object({
    name: z.string().trim().min(1),
    sku: z.string().trim().min(1),
    price: z.coerce.number().int().min(0),
    oldPrice: z.coerce.number().int().min(0).optional().nullable(),
    stock: z.coerce.number().int().min(0).optional(),
    image: optionalString,
    description: optionalString,
    category: z.string().trim().min(1).default("General"),
    brand: z.string().trim().min(1).default("UPG"),
    isNew: z.coerce.boolean().optional(),
    isFeatured: z.coerce.boolean().optional(),
  })).min(1).max(1000),
}).superRefine(({ products }, context) => {
  const seenSkus = new Set();
  const seenSlugs = new Set();

  products.forEach((product, index) => {
    const sku = product.sku.toLowerCase();
    const slug = productSlug(product.name, product.sku);

    if (seenSkus.has(sku)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["products", index, "sku"],
        message: "SKU must be unique within an import batch",
      });
    }
    seenSkus.add(sku);

    if (seenSlugs.has(slug)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["products", index, "name"],
        message: "Product slug must be unique within an import batch",
      });
    }
    seenSlugs.add(slug);

    if (!slugify(product.category) || !slugify(product.brand)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["products", index],
        message: "Category and brand must contain at least one letter or number",
      });
    }
  });
});
