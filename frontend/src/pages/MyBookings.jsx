import { useState } from "react";
import HorizontalCard from "../components/ui/HorizontalCard";
import totalBookings from "../data/totalBookings";
import EmptyState from "../components/ui/EmptyState";
import { FiSearch } from "react-icons/fi";

function MyBookings() {
  const tabs = [
    "All Bookings",
    "Confirmed",
    "Pending",
    "Completed",
    "Cancelled",
  ];

  const [activeTab, setActiveTab] = useState("All Bookings");

  const confirmedBookings = totalBookings.filter(
    (booking) => booking.status === "Confirmed",
  );

  const pendingBookings = totalBookings.filter(
    (booking) => booking.status === "Pending",
  );

  const completedBookings = totalBookings.filter(
    (booking) => booking.status === "Completed",
  );

  const cancelledBookings = totalBookings.filter(
    (booking) => booking.status === "Cancelled",
  );

  const tabCounts = {
    "All Bookings": totalBookings.length,
    Confirmed: confirmedBookings.length,
    Pending: pendingBookings.length,
    Completed: completedBookings.length,
    Cancelled: cancelledBookings.length,
  };

  return (
    <>
      <div className="p-7">
        <div className="flex items-center justify-between">
          {/* Header */}
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              My Bookings
            </h1>
            <p className="text-gray-500 text-[13px] sm:text-sm mt-0.5">
              Manage and track all your service appointments.
            </p>
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-52 lg:w-56">
            <FiSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full pl-8 pr-3 py-2  text-[12px] text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-50 transition-all duration-200 bg-white"
            />
          </div>
        </div>
        {/* Tabs */}
        <div className="flex my-5 items-center gap-0 sm:gap-5 border-b border-gray-200 mb-5 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 flex items-center gap-2 sm:px-4 py-2 text-[11px] sm:text-[13px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer border-b-2 ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
              {tabCounts[tab] > 0 && (
                <span
                  className={`text-[10px] flex items-center justify-center w-5 h-5 rounded-full font-semibold ${
                    activeTab === tab
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tabCounts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>
        {/* Content based on active tab */}
        <div className="mt-10">
          {/* All Bookings */}
          {activeTab === "All Bookings" && (
            <div className="flex flex-col gap-5">
              {totalBookings.length !== 0 ? (
                totalBookings.map((booking) => (
                  <HorizontalCard key={booking.id} booking={booking} />
                ))
              ) : (
                <EmptyState
                  title="No Bookings Yet"
                  description="You haven't booked any services yet.
                            Explore services and schedule your first appointment."
                  buttonLink="services"
                  buttonText="Browse Services"
                  className={`bg-blue-600 hover:bg-blue-700`}
                />
              )}
            </div>
          )}
          {/* Confirmed Bookings */}
          {activeTab === "Confirmed" && (
            <div className="flex flex-col gap-5">
              {confirmedBookings.length !== 0 ? (
                confirmedBookings.map((booking) => (
                  <HorizontalCard key={booking.id} booking={booking} />
                ))
              ) : (
                <EmptyState
                  title="No Confirmed Bookings"
                  description="You don't have any confirmed service appointments at the moment."
                  buttonLink="services"
                  buttonText="Browse Services"
                  className={`bg-blue-600 hover:bg-blue-700`}
                />
              )}
            </div>
          )}
          {/* Pending Bookings */}
          {activeTab === "Pending" && (
            <div className="flex flex-col gap-5">
              {pendingBookings.length !== 0 ? (
                pendingBookings.map((booking) => (
                  <HorizontalCard key={booking.id} booking={booking} />
                ))
              ) : (
                <EmptyState
                  title="No Pending Bookings"
                  description="You don't have any booking requests awaiting confirmation."
                />
              )}
            </div>
          )}
          {/* Completed Bookings */}
          {activeTab === "Completed" && (
            <div className="flex flex-col gap-5">
              {completedBookings.length !== 0 ? (
                completedBookings.map((booking) => (
                  <HorizontalCard key={booking.id} booking={booking} />
                ))
              ) : (
                <EmptyState
                  title="No Completed Services"
                  description="Your completed service history will appear here."
                />
              )}
            </div>
          )}
          {/* Cancelled Bookings */}
          {activeTab === "Cancelled" && (
            <div className="flex flex-col gap-5">
              {cancelledBookings.length !== 0 ? (
                cancelledBookings.map((booking) => (
                  <HorizontalCard key={booking.id} booking={booking} />
                ))
              ) : (
                <EmptyState
                  title="No Cancelled Services"
                  description="Your cancelled service history will appear here."
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyBookings;
