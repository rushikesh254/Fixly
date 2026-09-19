import CategoryModel from "../models/category.model.js";
import ReviewModel from "../models/review.model.js";
import ServiceModel from "../models/service.model.js";
import UserModel from "../models/user.model.js";
import {
  getCompletedBookingCounts,
  getProviderRatings,
  getServiceRatings,
} from "../utils/stats.js";
import { PRIVATE_USER_FIELDS } from "../utils/userFields.js";
import { updateProviderSchema } from "../validation/provider.validation.js";

// Public profile of a provider: the business details plus every service they
// publish and the reviews those services collected.
const getProviderById = async (req, res, next) => {
  try {
    const provider = await UserModel.findOne({
      _id: req.params.id,
      role: "provider",
      isDeleted: false,
    })
      .select(PRIVATE_USER_FIELDS)
      .populate("category", "name slug");

    if (!provider) {
      return res
        .status(404)
        .json({ success: false, message: "Provider not found" });
    }

    if (provider.providerStatus !== "approved") {
      return res
        .status(404)
        .json({ success: false, message: "Provider is not available" });
    }

    const services = await ServiceModel.find({ provider: provider._id })
      .populate("category")
      .sort({ createdAt: -1 });

    const serviceRatings = await getServiceRatings(
      services.map((service) => service._id),
    );

    const reviews = await ReviewModel.find({
      service: { $in: services.map((service) => service._id) },
    })
      .populate("user", "name profileImage")
      .populate("service", "name")
      .sort({ createdAt: -1 });

    const [ratings, completed] = await Promise.all([
      getProviderRatings([provider._id]),
      getCompletedBookingCounts([provider._id]),
    ]);

    const stats = ratings.get(provider._id.toString());

    res.status(200).json({
      success: true,
      provider: {
        ...provider.toObject(),
        rating: stats ? stats.rating : 0,
        totalReviews: stats ? stats.totalReviews : 0,
        bookingsCompleted: completed.get(provider._id.toString()) || 0,
        services: services.map((service) => {
          const plain = service.toObject();
          const serviceStats = serviceRatings.get(plain._id.toString());
          return {
            ...plain,
            rating: serviceStats ? serviceStats.rating : 0,
            totalReviews: serviceStats ? serviceStats.totalReviews : 0,
          };
        }),
        reviews,
      },
    });
  } catch (error) {
    console.error("Error fetching provider:", error);
    error.statusCode = 500;
    next(error);
  }
};

// Business details of the signed in provider, including the derived counters the
// dashboard and the profile page display.
const getMyProviderProfile = async (req, res, next) => {
  try {
    const [ratings, completed] = await Promise.all([
      getProviderRatings([req.user._id]),
      getCompletedBookingCounts([req.user._id]),
    ]);

    await req.user.populate("category", "name slug");
    const stats = ratings.get(req.user._id.toString());

    res.status(200).json({
      success: true,
      provider: {
        ...req.user.toObject(),
        rating: stats ? stats.rating : 0,
        totalReviews: stats ? stats.totalReviews : 0,
        bookingsCompleted: completed.get(req.user._id.toString()) || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    error.statusCode = 500;
    next(error);
  }
};

const updateMyProviderProfile = async (req, res, next) => {
  try {
    const result = updateProviderSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      return res.status(400).json({ success: false, message: messages });
    }
    const {
      providerName,
      experience,
      bio,
      category,
      gender,
      galleryImages,
      removeCoverImage,
    } = result.data;

    const provider = await UserModel.findById(req.user._id);

    if (providerName !== undefined) provider.providerName = providerName;
    if (experience !== undefined) provider.experience = experience;
    if (bio !== undefined) provider.bio = bio;
    if (gender !== undefined) provider.gender = gender;

    if (category !== undefined) {
      if (category === "") {
        provider.category = undefined;
      } else {
        const categoryExists = await CategoryModel.findById(category);
        if (!categoryExists) {
          return res
            .status(404)
            .json({ success: false, message: "Category not found" });
        }
        provider.category = category;
      }
    }

    // the client sends the gallery urls it kept, uploads are appended to them
    if (galleryImages !== undefined) provider.galleryImages = galleryImages;

    const coverFile = req.files?.coverImage?.[0];
    if (coverFile) {
      provider.coverImage = coverFile.path;
    } else if (removeCoverImage === "true") {
      provider.coverImage = "";
    }

    const galleryFiles = req.files?.galleryImages || [];
    if (galleryFiles.length > 0) {
      provider.galleryImages = [
        ...provider.galleryImages,
        ...galleryFiles.map((file) => file.path),
      ];
    }

    await provider.save();

    const safeProvider = await UserModel.findById(provider._id)
      .select(PRIVATE_USER_FIELDS)
      .populate("category", "name slug");

    res.status(200).json({
      success: true,
      message: "Provider information updated successfully",
      provider: safeProvider,
    });
  } catch (error) {
    console.error("Error updating provider profile:", error);
    error.statusCode = 500;
    next(error);
  }
};

// Every review left on any service of the signed in provider.
const getMyReviews = async (req, res, next) => {
  try {
    const services = await ServiceModel.find({ provider: req.user._id }).select(
      "_id",
    );

    const reviews = await ReviewModel.find({
      service: { $in: services.map((service) => service._id) },
    })
      .populate("user", "name profileImage")
      .populate("service", "name")
      .sort({ createdAt: -1 });

    const ratings = await getProviderRatings([req.user._id]);
    const stats = ratings.get(req.user._id.toString());

    res.status(200).json({
      success: true,
      count: reviews.length,
      rating: stats ? stats.rating : 0,
      totalReviews: stats ? stats.totalReviews : 0,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching provider reviews:", error);
    error.statusCode = 500;
    next(error);
  }
};

export {
  getMyProviderProfile,
  getMyReviews,
  getProviderById,
  updateMyProviderProfile,
};
