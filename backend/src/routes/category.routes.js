import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/category.controller.js";
import { autherize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllCategories);

router.post("/", protect, autherize("admin"), createCategory);

router.delete("/:id", protect, autherize("admin"), deleteCategory);

export default router;
