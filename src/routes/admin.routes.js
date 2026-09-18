import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { importProductFile } from "../controllers/admin.controller.js";

const router = Router();

router.post("/products/import", asyncHandler(importProductFile));

export default router;
