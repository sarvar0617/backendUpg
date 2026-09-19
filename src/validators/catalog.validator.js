import { z } from "zod";

const nonNegativeInt = z.coerce.number().int().min(0);

export const productQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  brand: z.string().trim().min(1).optional(),
  minPrice: nonNegativeInt.optional(),
  maxPrice: nonNegativeInt.optional(),
  sort: z.enum(["price_asc", "price_desc", "newest"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(1000).default(12),
}).superRefine((query, context) => {
  if (query.minPrice !== undefined && query.maxPrice !== undefined && query.minPrice > query.maxPrice) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["maxPrice"],
      message: "maxPrice must be greater than or equal to minPrice",
    });
  }
});
