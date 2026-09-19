import { toDateKey, toTime12h } from "./time";

// The api returns mongoose documents while the components were written against
// the flatter shapes in src/data. Everything the backend sends is mapped here, so
// the pages and cards keep working without changing their markup.

const STATUS_LABEL = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

// the api stores booking status in lowercase, the ui labels are capitalised
export const toStatusLabel = (status) => STATUS_LABEL[status] || "Pending";

export const formatAddress = (address) => {
  if (!address) return "";
  return [address.flat, address.street, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(", ");
};

// the cards show a short place name, prefer the provider's city over the full line
const addressCity = (provider, fallbackLine = "") => {
  if (provider?.address?.city) return provider.address.city;

  // "Shop 4, Some Road, Prayagraj, Uttar Pradesh, 211001" -> "Prayagraj"
  const parts = fallbackLine.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.length >= 3 ? parts[parts.length - 3] : parts[0] || "";
};

export const normalizeReview = (review) => ({
  id: review._id,
  user: review.user?.name || "Customer",
  image: review.user?.profileImage || "",
  rating: review.rating,
  comment: review.comment,
  date: review.createdAt,
  serviceName: review.service?.name || "",
});

// Flattened service + provider, the shape ServiceCard, ProviderCard, Gallery,
// BookingCard and ConfirmModal all read from.
export const normalizeService = (service) => {
  if (!service) return null;

  const provider = service.provider || {};
  const images = service.images || [];

  return {
    id: service._id,
    serviceId: service._id,
    providerId: provider._id || service.provider,

    // service fields
    title: service.name,
    description: service.description,
    price: service.price,
    duration: service.duration,
    estimatedDuration: service.estimatedDuration || "",
    includes: service.includes || [],
    availableToday: Boolean(service.availableToday),
    instantBooking: Boolean(service.instantBooking),
    category: service.category?.name || "",
    categoryId: service.category?._id || service.category || "",
    coverImage: images[0] || provider.coverImage || "",
    galleryImages: images.slice(1),
    address: service.address || "",
    location: addressCity(provider, service.address),
    coordinates: service.location?.coordinates || null,

    // provider fields
    providerName: provider.providerName || provider.name || "",
    name: provider.name || "",
    image: provider.profileImage || "",
    experience: provider.experience || "",
    bio: provider.bio || "",
    phoneNumber: provider.phoneNumber || "",
    email: provider.email || "",
    status: provider.providerStatus || "approved",

    // derived on the server
    rating: service.rating ?? 0,
    totalReviews: service.totalReviews ?? 0,
    bookingsCompleted: service.bookingsCompleted ?? 0,

    createdAt: service.createdAt,
  };
};

// Public provider profile, used by ViewDetails and the provider profile page.
export const normalizeProvider = (provider) => {
  if (!provider) return null;

  const address = provider.address || null;

  return {
    id: provider._id,
    providerId: provider._id,
    name: provider.name || "",
    providerName: provider.providerName || provider.name || "",
    email: provider.email || "",
    phoneNumber: provider.phoneNumber || "",
    image: provider.profileImage || "",
    coverImage: provider.coverImage || "",
    galleryImages: provider.galleryImages || [],
    bio: provider.bio || "",
    experience: provider.experience || "",
    gender: provider.gender || "",
    category: provider.category?.name || "",
    categoryId: provider.category?._id || provider.category || "",
    status: provider.providerStatus || "pending",
    appliedAt: provider.appliedAt || provider.createdAt,
    address: address
      ? {
          area: [address.flat, address.street].filter(Boolean).join(", "),
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        }
      : null,
    location: address?.city || "",
    lat: address?.lat ?? null,
    lon: address?.lon ?? null,
    rating: provider.rating ?? 0,
    totalReviews: provider.totalReviews ?? 0,
    bookingsCompleted: provider.bookingsCompleted ?? 0,
    services: (provider.services || []).map((service) => ({
      serviceId: service._id,
      title: service.name,
      category: service.category?.name || "",
      categoryId: service.category?._id || service.category || "",
      price: service.price,
      estimatedDuration: service.estimatedDuration || "",
      description: service.description || "",
      includes: service.includes || [],
      availableToday: Boolean(service.availableToday),
      instantBooking: Boolean(service.instantBooking),
      images: service.images || [],
      rating: service.rating ?? 0,
      totalReviews: service.totalReviews ?? 0,
    })),
    reviews: (provider.reviews || []).map(normalizeReview),
  };
};

// Booking shape shared by the customer cards, the provider request modals and the
// admin booking table.
export const normalizeBooking = (booking) => {
  if (!booking) return null;

  const service = booking.service || {};
  const provider = booking.provider || {};
  const customer = booking.user || {};
  const status = toStatusLabel(booking.status);

  return {
    id: booking._id,
    bookingId: booking._id,
    serviceId: service._id || booking.service,
    providerId: provider._id || booking.provider,
    userId: customer._id || booking.user,

    serviceTitle: service.name || "Service",
    // the dashboard hero reads serviceName, the cards read serviceTitle
    serviceName: service.name || "Service",
    providerName: provider.providerName || provider.name || "",
    image: service.images?.[0] || provider.coverImage || "",
    estimatedTime: service.estimatedDuration || `${booking.duration} mins`,
    category: service.category?.name || "",

    price: booking.amount,
    date: toDateKey(booking.bookingDate),
    time: toTime12h(booking.bookingTime),
    address: booking.address || "",
    userAddress: booking.address || "",
    location: addressCity(provider, booking.address),
    status,
    statusValue: booking.status,

    instruction: booking.specialInstructions || "",
    specialInstructions: booking.specialInstructions || "",
    isReviewed: Boolean(booking.isReviewed),

    // the customer behind the booking, shown to the provider and the admin
    customer: customer._id ? customer : null,
    customerName: customer.name || "",
    customerPhone: customer.phoneNumber || "",
    customerEmail: customer.email || "",
    providerPhone: provider.phoneNumber || "",
    providerEmail: provider.email || "",

    payment: {
      amount: booking.amount,
      status: booking.paymentStatus || "Pay after Service",
    },

    bookedAt: booking.createdAt,
    confirmedAt: booking.confirmedAt || null,
    completedAt: booking.completedAt || null,
    cancelledAt: booking.cancelledAt || null,
    rejectedAt: booking.rejectedAt || null,
  };
};

// Customer row for the admin users table.
export const normalizeUserRow = (user) => {
  const address = user.address || null;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phoneNumber || "",
    image: user.profileImage || "",
    status: user.status || "active",
    joinedAt: user.createdAt,
    totalBookings: user.totalBookings ?? 0,
    address: address
      ? {
          area: [address.flat, address.street].filter(Boolean).join(", "),
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        }
      : undefined,
  };
};

// Saved service row, matches the fields SavedCard reads.
export const normalizeSavedService = (service) => {
  const normalized = normalizeService(service);
  if (!normalized) return null;

  return {
    ...normalized,
    // SavedCard renders `image`, which for a saved service is the cover photo
    image: normalized.coverImage,
  };
};
