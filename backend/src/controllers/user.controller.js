import BookingModel from "../models/booking.model.js";
import ServiceModel from "../models/service.model.js";
import UserModel from "../models/user.model.js";
import { clearRefreshTokenCookie } from "../utils/token.js";
import { getServiceRatings } from "../utils/stats.js";
import { PRIVATE_USER_FIELDS } from "../utils/userFields.js";
import {
  favoriteSchema,
  saveAddressSchema,
} from "../validation/user.validation.js";

// ---------------------------------------------------------------- favorites

const getFavorites = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id).populate({
      path: "favorites",
      populate: [
        { path: "category" },
        { path: "provider", select: PRIVATE_USER_FIELDS },
      ],
    });

    // a service can be deleted after it was bookmarked, drop those entries
    const services = (user.favorites || []).filter(Boolean);
    const ratings = await getServiceRatings(services.map((item) => item._id));

    const favorites = services.map((service) => {
      const plain = service.toObject();
      const stats = ratings.get(plain._id.toString());
      return {
        ...plain,
        rating: stats ? stats.rating : 0,
        totalReviews: stats ? stats.totalReviews : 0,
      };
    });

    res
      .status(200)
      .json({ success: true, count: favorites.length, favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    error.statusCode = 500;
    next(error);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const result = favoriteSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      return res.status(400).json({ success: false, message: messages });
    }
    const { serviceId } = result.data;

    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    // $addToSet keeps the call idempotent when two tabs save at the same time
    await UserModel.findByIdAndUpdate(req.user._id, {
      $addToSet: { favorites: serviceId },
    });

    res
      .status(200)
      .json({ success: true, message: "Service saved successfully" });
  } catch (error) {
    console.error("Error saving favorite:", error);
    error.statusCode = 500;
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    await UserModel.findByIdAndUpdate(req.user._id, {
      $pull: { favorites: serviceId },
    });

    res
      .status(200)
      .json({ success: true, message: "Service removed from saved list" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    error.statusCode = 500;
    next(error);
  }
};

// ---------------------------------------------------------------- address

// An account holds exactly one address. It can be changed or removed, but never
// duplicated, so there is no list and no default to keep track of.

const getAddress = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id).select("address");

    res.status(200).json({ success: true, address: user.address || null });
  } catch (error) {
    console.error("Error fetching address:", error);
    error.statusCode = 500;
    next(error);
  }
};

// Upsert: the same call saves the first address and edits it later on.
const saveAddress = async (req, res, next) => {
  try {
    const result = saveAddressSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      return res.status(400).json({ success: false, message: messages });
    }

    const user = await UserModel.findById(req.user._id);
    const isNew = !user.address;

    user.address = result.data;
    await user.save();

    res.status(200).json({
      success: true,
      message: isNew
        ? "Address saved successfully"
        : "Address updated successfully",
      address: user.address,
    });
  } catch (error) {
    console.error("Error saving address:", error);
    error.statusCode = 500;
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user.address) {
      return res
        .status(404)
        .json({ success: false, message: "No address to remove" });
    }

    user.address = null;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Address removed successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    error.statusCode = 500;
    next(error);
  }
};

// ---------------------------------------------------------------- activity feed

// Derived from the bookings of the signed in user instead of a separate log, so
// the feed can never disagree with the bookings it describes.
const getMyActivities = async (req, res, next) => {
  try {
    const bookings = await BookingModel.find({ user: req.user._id })
      .populate("service", "name")
      .sort({ createdAt: -1 })
      .limit(20);

    const activities = [];

    bookings.forEach((booking) => {
      const serviceName = booking.service?.name || "Service";

      activities.push({
        id: `${booking._id}-booked`,
        type: "booking",
        serviceName,
        createdAt: booking.createdAt,
      });

      if (booking.completedAt) {
        activities.push({
          id: `${booking._id}-completed`,
          type: "completed",
          serviceName,
          createdAt: booking.completedAt,
        });
      }

      if (booking.cancelledAt) {
        activities.push({
          id: `${booking._id}-cancelled`,
          type: "cancelled",
          serviceName,
          createdAt: booking.cancelledAt,
        });
      }
    });

    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: activities.length,
      activities: activities.slice(0, 8),
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    error.statusCode = 500;
    next(error);
  }
};

// ---------------------------------------------------------------- account

// Soft delete: the account is anonymised and disabled but the document stays so
// past bookings and reviews keep a valid reference for the other party.
const deleteMyAccount = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin accounts cannot be deleted" });
    }

    // call off anything still scheduled so providers are not left with bookings
    // nobody will show up for
    await BookingModel.updateMany(
      {
        $or: [{ user: user._id }, { provider: user._id }],
        status: { $in: ["pending", "confirmed"] },
      },
      {
        status: "cancelled",
        cancelledAt: new Date(),
        paymentStatus: "Not Paid",
      },
    );

    user.isDeleted = true;
    user.deletedAt = new Date();
    user.status = "blocked";
    // free the unique email index so the address can be used to sign up again
    user.email = `deleted+${user._id}@fixly.invalid`;
    user.phoneNumber = "";
    user.address = null;
    user.favorites = [];
    user.profileImage = "";
    user.coverImage = "";
    user.galleryImages = [];
    user.refreshToken = "";
    if (user.role === "provider") user.providerStatus = "blocked";
    await user.save();

    clearRefreshTokenCookie(res);

    res
      .status(200)
      .json({ success: true, message: "Your account has been deleted" });
  } catch (error) {
    console.error("Error deleting account:", error);
    error.statusCode = 500;
    next(error);
  }
};

export {
  addFavorite,
  deleteAddress,
  deleteMyAccount,
  getAddress,
  getFavorites,
  getMyActivities,
  removeFavorite,
  saveAddress,
};
