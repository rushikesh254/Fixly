import { Router } from "express";
import { createCategory, getAllCategories } from "../controllers/category.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllCategories);

router.post("/", protect, authorize("admin"), createCategory);

export default router;
