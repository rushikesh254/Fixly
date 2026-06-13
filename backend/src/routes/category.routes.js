import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../controllers/category.controller.js";
import { autherize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getCategories);
router.post("/", protect, autherize("admin"), createCategory);
router.delete("/:id", protect, autherize("admin"), deleteCategory);

export default router;
