import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";

const productInclude = {
  category: true,
  brand: true,
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
  include: { _count: { select: { products: true } } },
});

export const getProducts = async (query) => {
  const { page, limit, sort, ...filters } = query;
  const where = getProductWhere(filters);
  const skip = (page - 1) * limit;

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
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
    include: productInclude,
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
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });

  return { category, products };
};
