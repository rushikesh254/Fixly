import { Router } from "express";
import {
  createCategory,
  getCategories,
  deleteCategory,
} from "../controllers/category.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getCategories);
router.post("/", protect, createCategory);
router.delete("/:id", protect, deleteCategory);

export default router;
