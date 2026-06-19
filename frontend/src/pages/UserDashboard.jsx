import { Link, useNavigate } from "react-router-dom";
import recentActivities from "../data/recentActivities";
import savedList from "../data/savedList";
import totalBookings from "../data/totalBookings";
import userData from "../data/userData";

import {
  CiBookmarkCheck,
  CiCircleCheck,
  CiCircleRemove,
  CiViewList,
} from "react-icons/ci";
import { FiArrowRight } from "react-icons/fi";
import { MdOutlineAccessTime } from "react-icons/md";
import { TfiMoney } from "react-icons/tfi";
import HorizontalCard from "../components/ui/HorizontalCard";
import PrimaryBtn from "../components/ui/PrimaryBtn";
import SavedCard from "../components/ui/SavedCard";
import EmptyState from "../components/ui/EmptyState";

function UserDashboard() {
  const navigate = useNavigate();

  const upcomingBookings = totalBookings.filter(
    (b) => b.status === "Pending" || b.status === "Confirmed",
  );

  const nextBooking = upcomingBookings[0] ?? null;

  const upcomingCount = upcomingBookings.length;

  const completedCount = totalBookings.filter(
    (b) => b.status === "Completed",
  ).length;

  const totalSpent = totalBookings
    .filter((b) => b.status === "Completed")
    .reduce((sum, b) => sum + b.price, 0);

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
      value: savedList.length,
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

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:px-15">
      {/* Welcome Section */}
      <div className="rounded-2xl bg-blue-600 px-6 py-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome Back, {userData.name.split(" ")[0]}!
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
                <PrimaryBtn btn="Details" />
                <button
                  onClick={() => navigate("")}
                  className="px-4 py-2 cursor-pointer text-sm font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                >
                  Reschedule
                </button>
              </div>
            </div>
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
              {savedList.length === 0 ? (
                <EmptyState
                  title="No Services Saved"
                  description="You haven't saved any services yet. Save services to quickly
                    access them later."
                  buttonLink="services"
                  buttonText="Explore Services"
                  className={`bg-amber-500 hover:bg-amber-600`}
                />
              ) : (
                savedList
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
