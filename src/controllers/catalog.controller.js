import { z } from "zod";
import {
  getCategories,
  getProductBySlug,
  getProducts,
  getProductsByCategorySlug,
} from "../services/catalog.service.js";
import { productQuerySchema } from "../validators/catalog.validator.js";

const slugSchema = z.string().trim().min(1);
const DEFAULT_COLLECTION_LIMIT = 12;

export const listCategories = async (_req, res) => {
  const categories = await getCategories();

  res.json({
    success: true,
    data: categories,
    pagination: {
      page: 1,
      limit: DEFAULT_COLLECTION_LIMIT,
      total: categories.length,
      totalPages: categories.length > 0 ? 1 : 0,
    },
  });
};

export const listProducts = async (req, res) => {
  const query = productQuerySchema.parse(req.query);
  const { products, pagination } = await getProducts(query);

  res.json({
    success: true,
    data: products,
    pagination,
  });
};

export const showProduct = async (req, res) => {
  const slug = slugSchema.parse(req.params.slug);
  const product = await getProductBySlug(slug);

  res.json({
    success: true,
    data: product,
    pagination: null,
  });
};

export const listCategoryProducts = async (req, res) => {
  const slug = slugSchema.parse(req.params.slug);
  const { category, products } = await getProductsByCategorySlug(slug);

  res.json({
    success: true,
    data: {
      category,
      products,
    },
    pagination: {
      page: 1,
      limit: DEFAULT_COLLECTION_LIMIT,
      total: products.length,
      totalPages: products.length > 0 ? 1 : 0,
    },
  });
};
