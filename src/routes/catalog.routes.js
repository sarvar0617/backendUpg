import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  listCategories,
  listCategoryProducts,
  listProducts,
  showProduct,
} from "../controllers/catalog.controller.js";

const router = Router();

router.get("/categories", asyncHandler(listCategories));
router.get("/categories/:slug/products", asyncHandler(listCategoryProducts));
router.get("/products", asyncHandler(listProducts));
router.get("/products/:slug", asyncHandler(showProduct));

export default router;
