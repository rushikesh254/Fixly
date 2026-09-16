import { useState } from "react";
import { Link } from "react-router-dom";
import DetailModal from "../../components/user/DetailModal";
import { useSaved } from "../../context/savedContext";
import { userBookings } from "../../data/bookings";
import recentActivities from "../../data/recentActivities";

import {
  CiBookmarkCheck,
  CiCircleCheck,
  CiCircleRemove,
  CiViewList,
} from "react-icons/ci";
import { FiArrowRight } from "react-icons/fi";
import { MdOutlineAccessTime } from "react-icons/md";
import { TfiMoney } from "react-icons/tfi";
import { toast } from "sonner";
import EmptyState from "../../components/ui/EmptyState";
import PrimaryBtn from "../../components/ui/PrimaryBtn";
import SecondaryBtn from "../../components/ui/SecondaryBtn";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import HorizontalCard from "../../components/user/HorizontalCard";
import SavedCard from "../../components/user/SavedCard";
import { useAuth } from "../../context/AuthContext";

function UserDashboard() {
  const { savedServices } = useSaved();
  const { user } = useAuth();

  const upcomingBookings = userBookings.filter(
    (b) => b.status === "Pending" || b.status === "Confirmed",
  );

  const nextBooking = upcomingBookings[0] ?? null;

  const upcomingCount = upcomingBookings.length;

  const completedCount = userBookings.filter(
    (b) => b.status === "Completed",
  ).length;

  const totalSpent = userBookings
    .filter((b) => b.status === "Completed")
    .reduce((sum, b) => sum + b.price, 0);

  // Stats data for the dashboard
  const statsData = [
    {
      title: "UPCOMING SERVICES",
      value: upcomingCount,
      icon: <CiViewList size={22} />,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "COMPLETED SERVICES",
      value: completedCount,
      icon: <CiCircleCheck size={22} />,
      iconClass: "bg-green-100 text-green-600",
    },
    {
      title: "SAVED SERVICES",
      value: savedServices.length,
      icon: <CiBookmarkCheck size={22} />,
      iconClass: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "TOTAL SPENT",
      value: `₹ ${totalSpent}`,
      icon: <TfiMoney size={22} />,
      iconClass: "bg-purple-100 text-purple-600",
    },
  ];

  //state for cancel modal and detail modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const statusConfig = {
    Pending: {
      banner: "bg-amber-50 border-amber-200",
      bannerText: "text-amber-700",
      icon: "bg-amber-100 text-amber-600",
      message: "Awaiting Provider Confirmation",
      description:
        "Your booking request is waiting for the provider to accept.",
    },
    Confirmed: {
      banner: "bg-emerald-50 border-emerald-200",
      bannerText: "text-emerald-700",
      icon: "bg-emerald-100 text-emerald-600",
      message: "Booking Confirmed",
      description:
        "The provider has accepted your booking. You can contact them for any queries.",
    },
    Completed: {
      banner: "bg-blue-50 border-blue-200",
      bannerText: "text-blue-700",
      icon: "bg-blue-100 text-blue-600",
      message: "Service Completed",
      description: "This service has been completed successfully.",
    },
    Cancelled: {
      banner: "bg-slate-50 border-slate-200",
      bannerText: "text-slate-700",
      icon: "bg-slate-100 text-slate-600",
      message: "Booking Cancelled",
      description: "This booking was cancelled and cannot be restored.",
    },
    Rejected: {
      banner: "bg-red-50 border-red-200",
      bannerText: "text-red-700",
      icon: "bg-red-100 text-red-600",
      message: "Booking Rejected",
      description:
        "The provider was unable to take this booking. Try another provider.",
    },
  };

  const cfg = statusConfig[nextBooking?.status] || statusConfig.Pending;

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:px-15">
      {/* Welcome Section */}
      <div className="rounded-2xl bg-blue-600 px-6 py-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome Back, {user.name.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-sm text-blue-100">
            Here's a quick overview of your activity and upcoming services.
          </p>
        </div>
        <Link
          to="/services"
          className="w-fit px-6 py-3 bg-white text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition"
        >
          Book a Service
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="flex gap-4 rounded-2xl bg-white border border-gray-200 p-5"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconClass}`}
            >
              {stat.icon}
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* next booking */}
          {nextBooking && (
            <div className="rounded-2xl border-l-4 border-blue-500 bg-white border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MdOutlineAccessTime size={18} className="text-blue-500" />
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                    Your Next Service
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    nextBooking.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {nextBooking.status}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {nextBooking.image && (
                  <img
                    src={nextBooking.image}
                    alt={nextBooking.serviceName}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900">
                    {nextBooking.serviceName}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {nextBooking.providerName}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {nextBooking.date} · {nextBooking.time}
                  </p>
                </div>
                <p className="text-base font-bold text-gray-800">
                  ₹{nextBooking.price}
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                <PrimaryBtn
                  btn="Details"
                  onclick={() => {
                    setShowDetailModal(true);
                  }}
                />
                <SecondaryBtn
                  btn="Cancel"
                  className="text-red-600! border border-red-200! hover:bg-red-50!"
                  onclick={() => setShowCancelModal(true)}
                />
              </div>
            </div>
          )}
          {showDetailModal && (
            <DetailModal
              booking={nextBooking}
              showDetailModal={showDetailModal}
              setShowDetailModal={setShowDetailModal}
              setShowCancelModal={setShowCancelModal}
              cfg={cfg}
            />
          )}
          {showCancelModal && (
            <ConfirmDialog
              title="Cancel this service?"
              message="Are you sure you want to cancel this booking? This action cannot be undone."
              cancelLabel="Keep Booking"
              confirmLabel="Yes, Cancel"
              onCancel={() => setShowCancelModal(false)}
              onConfirm={() => {
                setShowCancelModal(false);
                toast.success("Your booking has been cancelled successfully.");
              }}
            />
          )}
          {/* Upcoming Bookings */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-blue-600 inline-block"></span>
                UPCOMING BOOKINGS
              </h2>
              <Link
                to="/user/mybookings"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
              >
                View All <FiArrowRight />
              </Link>
            </div>

            <div className="flex flex-col gap-4 mt-5">
              {upcomingCount === 0 ? (
                <EmptyState
                  title="No Upcoming Bookings"
                  description="You don't have any upcoming service bookings. Explore
                  services and book a trusted provider."
                  buttonLink="services"
                  buttonText="Browse Services"
                  className={`bg-blue-600 hover:bg-blue-700`}
                />
              ) : (
                upcomingBookings
                  .slice(0, 5)
                  .map((booking) => (
                    <HorizontalCard
                      key={booking.id}
                      booking={booking}
                      compact
                    />
                  ))
              )}
            </div>
          </div>
          {/* Saved Services */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-amber-500 inline-block"></span>
                SAVED SERVICES
              </h2>
              <Link
                to="/user/saved"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-1 text-amber-600 text-sm hover:underline"
              >
                View All <FiArrowRight />
              </Link>
            </div>

            <div className="flex flex-col gap-4 mt-5">
              {savedServices.length === 0 ? (
                <EmptyState
                  title="No Services Saved"
                  description="You haven't saved any services yet. Save services to quickly
                    access them later."
                  buttonLink="services"
                  buttonText="Explore Services"
                  className={`bg-amber-500 hover:bg-amber-600`}
                />
              ) : (
                savedServices
                  .slice(0, 3)
                  .map((booking) => (
                    <SavedCard key={booking.id} booking={booking} compact />
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-1">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-emerald-500 inline-block"></span>
            RECENT ACTIVITIES
          </h2>

          <div className="mt-5 flex flex-col gap-3">
            {recentActivities.length === 0 ? (
              <EmptyState
                title="No Recent Activity"
                description="Your recent actions will appear here."
              />
            ) : (
              recentActivities.map((activity, idx) => {
                const colorMap = {
                  booking: "bg-blue-100 text-blue-600",
                  saved: "bg-yellow-100 text-yellow-600",
                  completed: "bg-green-100 text-green-600",
                  cancelled: "bg-red-100 text-red-600",
                };
                const iconMap = {
                  booking: <CiViewList size={16} />,
                  saved: <CiBookmarkCheck size={16} />,
                  completed: <CiCircleCheck size={16} />,
                  cancelled: <CiCircleRemove size={16} />,
                };

                return (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${colorMap[activity.type]}`}
                      >
                        {iconMap[activity.type]}
                      </div>
                      {idx < recentActivities.length - 1 && (
                        <div className="mt-1 h-full w-px bg-gray-200"></div>
                      )}
                    </div>
                    <div className="flex-1 rounded-xl border border-gray-200 bg-white p-3.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.serviceName}
                        </p>
                        <span className="text-xs text-gray-400">
                          {activity.createdAt}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500 capitalize">
                        {activity.type}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
