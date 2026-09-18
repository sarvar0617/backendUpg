import { z } from "zod";

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
});
