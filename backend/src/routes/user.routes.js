import { Router } from "express";
import {
  addFavorite,
  deleteAddress,
  deleteMyAccount,
  getAddress,
  getFavorites,
  getMyActivities,
  removeFavorite,
  saveAddress,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// every route below belongs to the signed in user, so the id never comes from
// the request and one user can never reach another user's data
router.use(protect);

// saved services
router.get("/me/favorites", getFavorites);
router.post("/me/favorites", addFavorite);
router.delete("/me/favorites/:serviceId", removeFavorite);

// the single address of the account ( PUT both saves and updates it )
router.get("/me/address", getAddress);
router.put("/me/address", saveAddress);
router.delete("/me/address", deleteAddress);

// dashboard activity feed
router.get("/me/activities", getMyActivities);

// account deletion ( soft delete )
router.delete("/me", deleteMyAccount);

export default router;
