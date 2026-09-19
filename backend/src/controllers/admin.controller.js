import BookingModel from "../models/booking.model.js";
import ServiceModel from "../models/service.model.js";
import UserModel from "../models/user.model.js";
import {
  getBookingCountsByUser,
  getCompletedBookingCounts,
  getProviderRatings,
} from "../utils/stats.js";
import { PRIVATE_USER_FIELDS } from "../utils/userFields.js";
import {
  updateProviderStatusSchema,
  updateUserStatusSchema,
} from "../validation/admin.validation.js";

// Start of the local day, used so the "today" counters line up with what the
// admin sees on their own clock rather than with UTC.
const startOfDay = (date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const getStats = async (req, res, next) => {
  try {
    const todayStart = startOfDay(new Date());
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    // a service counts as live when the provider behind it is approved and active
    const liveProviders = await UserModel.find({
      role: "provider",
      providerStatus: "approved",
      status: "active",
      isDeleted: false,
    }).select("_id");

    const weekStart = startOfDay(new Date());
    weekStart.setDate(weekStart.getDate() - 6);

    const [providers, users, todayBookings, servicesLive, pendingApprovals, weekBookings] =
      await Promise.all([
        UserModel.countDocuments({ role: "provider", isDeleted: false }),
        UserModel.countDocuments({ role: "user", isDeleted: false }),
        BookingModel.countDocuments({
          bookingDate: { $gte: todayStart, $lt: tomorrowStart },
        }),
        ServiceModel.countDocuments({
          provider: { $in: liveProviders.map((item) => item._id) },
        }),
        UserModel.countDocuments({
          role: "provider",
          providerStatus: "pending",
          isDeleted: false,
        }),
        BookingModel.find({ bookingDate: { $gte: weekStart } }).select(
          "bookingDate",
        ),
      ]);

    // build the last 7 days series on the server so the chart and the counters
    // agree on what "a day" means
    const weekData = [];
    for (let index = 6; index >= 0; index -= 1) {
      const day = startOfDay(new Date());
      day.setDate(day.getDate() - index);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      weekData.push({
        name: day.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        bookings: weekBookings.filter((booking) => {
          const date = new Date(booking.bookingDate);
          return date >= day && date < nextDay;
        }).length,
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        providers,
        users,
        todayBookings,
        servicesLive,
        pendingApprovals,
      },
      weekData,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    error.statusCode = 500;
    next(error);
  }
};

// ---------------------------------------------------------------- customers

const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find({ role: "user", isDeleted: false })
      .select(PRIVATE_USER_FIELDS)
      .sort({ createdAt: -1 });

    const counts = await getBookingCountsByUser(users.map((user) => user._id));

    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map((user) => ({
        ...user.toObject(),
        totalBookings: counts.get(user._id.toString()) || 0,
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    error.statusCode = 500;
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const result = updateUserStatusSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      return res.status(400).json({ success: false, message: messages });
    }
    const { status } = result.data;

    const user = await UserModel.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin accounts cannot be blocked" });
    }

    user.status = status;
    // blocking has to end the active session as well
    if (status === "blocked") user.refreshToken = "";
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${status === "blocked" ? "blocked" : "unblocked"} successfully`,
      user: { _id: user._id, status: user.status },
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    error.statusCode = 500;
    next(error);
  }
};

// ---------------------------------------------------------------- providers

const getProviders = async (req, res, next) => {
  try {
    const providers = await UserModel.find({
      role: "provider",
      isDeleted: false,
    })
      .select(PRIVATE_USER_FIELDS)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    const providerIds = providers.map((provider) => provider._id);

    const [ratings, completed, services] = await Promise.all([
      getProviderRatings(providerIds),
      getCompletedBookingCounts(providerIds),
      ServiceModel.find({ provider: { $in: providerIds } }).populate(
        "category",
        "name slug",
      ),
    ]);

    res.status(200).json({
      success: true,
      count: providers.length,
      providers: providers.map((provider) => {
        const key = provider._id.toString();
        const stats = ratings.get(key);

        return {
          ...provider.toObject(),
          rating: stats ? stats.rating : 0,
          totalReviews: stats ? stats.totalReviews : 0,
          bookingsCompleted: completed.get(key) || 0,
          services: services
            .filter((service) => service.provider.toString() === key)
            .map((service) => service.toObject()),
        };
      }),
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    error.statusCode = 500;
    next(error);
  }
};

const updateProviderStatus = async (req, res, next) => {
  try {
    const result = updateProviderStatusSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      return res.status(400).json({ success: false, message: messages });
    }
    const { status } = result.data;

    const provider = await UserModel.findOne({
      _id: req.params.id,
      role: "provider",
      isDeleted: false,
    });

    if (!provider) {
      return res
        .status(404)
        .json({ success: false, message: "Provider not found" });
    }

    provider.providerStatus = status;
    // a blocked provider also loses access to the platform itself
    provider.status = status === "blocked" ? "blocked" : "active";
    if (status === "blocked") provider.refreshToken = "";
    await provider.save();

    res.status(200).json({
      success: true,
      message: `Provider ${status} successfully`,
      provider: {
        _id: provider._id,
        providerStatus: provider.providerStatus,
        status: provider.status,
      },
    });
  } catch (error) {
    console.error("Error updating provider status:", error);
    error.statusCode = 500;
    next(error);
  }
};

// ---------------------------------------------------------------- bookings

const getBookings = async (req, res, next) => {
  try {
    const bookings = await BookingModel.find()
      .populate({ path: "service", populate: { path: "category" } })
      .populate("user", PRIVATE_USER_FIELDS)
      .populate("provider", PRIVATE_USER_FIELDS)
      .sort({ bookingDate: -1 });

    res
      .status(200)
      .json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    error.statusCode = 500;
    next(error);
  }
};

export {
  getBookings,
  getProviders,
  getStats,
  getUsers,
  updateProviderStatus,
  updateUserStatus,
};
