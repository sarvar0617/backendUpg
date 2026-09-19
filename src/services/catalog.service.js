import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";

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

const getProductWhere = ({ search, category, brand, minPrice, maxPrice }) => ({
  ...(search && {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ],
  }),
  ...(category && { category: { slug: category } }),
  ...(brand && { brand: { slug: brand } }),
  ...((minPrice !== undefined || maxPrice !== undefined) && {
    price: {
      ...(minPrice !== undefined && { gte: minPrice }),
      ...(maxPrice !== undefined && { lte: maxPrice }),
    },
  }),
});

const getProductOrderBy = (sort) => {
  if (sort === "price_asc") return { price: "asc" };
  if (sort === "price_desc") return { price: "desc" };
  return { createdAt: "desc" };
};

export const getCategories = () => prisma.category.findMany({
  orderBy: { name: "asc" },
  select: {
    id: true,
    name: true,
    slug: true,
    image: true,
    _count: { select: { products: true } },
  },
});

export const getProducts = async (query) => {
  const { page, limit, sort, ...filters } = query;
  const where = getProductWhere(filters);
  const skip = (page - 1) * limit;

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      select: productSelect,
      orderBy: getProductOrderBy(sort),
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductBySlug = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: productSelect,
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

export const getProductsByCategorySlug = async (slug) => {
  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    select: productSelect,
    orderBy: { createdAt: "desc" },
  });

  return { category, products };
};
