import { Router } from "express";
import {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  updateService,
} from "../controllers/service.controller.js";
import { autherize, protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.get("/", getAllServices);

router.get("/:id", getServiceById);

router.post(
  "/",
  protect,
  autherize("admin", "provider"),
  upload.array("images", 5), // multer middleware to handle file uploads, allowing up to 5 images
  createService,
);

router.put(
  "/:id",
  protect,
  autherize("admin", "provider"),
  upload.array("images", 5), // multer middleware to handle file uploads, allowing up to 5 images
  updateService,
);

router.delete("/:id", protect, autherize("admin", "provider"), deleteService);

export default router;
