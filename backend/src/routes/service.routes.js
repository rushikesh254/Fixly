import { Router } from "express";
import {
  createService,
  deleteService,
  getAllServices,
  getMyServices,
  getServiceById,
  updateService,
} from "../controllers/service.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.get("/", getAllServices);

// must be declared before "/:id" so it is not treated as a service id
router.get(
  "/my-services",
  protect,
  authorize("admin", "provider"),
  getMyServices,
);

router.get("/:id", getServiceById);

router.post(
  "/",
  protect,
  authorize("admin", "provider"),
  upload.array("images", 5),
  createService,
);

router.put(
  "/:id",
  protect,
  authorize("admin", "provider"),
  upload.array("images", 5),
  updateService,
);

router.delete("/:id", protect, authorize("admin", "provider"), deleteService);

export default router;
