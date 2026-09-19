import { Router } from "express";
import {
  createServiceType,
  getAllServiceTypes,
} from "../controllers/serviceType.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

// public so the provider service form can list the titles it may choose from
router.get("/", getAllServiceTypes);

router.post("/", protect, authorize("admin"), createServiceType);

export default router;
