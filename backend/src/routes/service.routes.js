import { Router } from "express";
import {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  updateService,
} from "../controllers/service.controller.js";
import protect from "../middleware/auth.middleware.js";
const router = Router();

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", protect, createService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

export default router;
