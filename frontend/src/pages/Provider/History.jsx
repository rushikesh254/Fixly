import { useState } from "react";
import bookings from "../../data/bookings";
import EmptyState from "../../components/ui/EmptyState";
import HistoryDetailModal from "../../components/provider/HistoryDetailModal";
import { FiCalendar, FiMapPin, FiSearch } from "react-icons/fi";
import getBookingDateTime from "../../utils/getBookingDateTime";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const badgeStyles = {
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-gray-100 text-gray-500",
  Rejected: "bg-red-100 text-red-600",
};

function History() {
  const tabs = ["All", "Completed", "Cancelled", "Rejected"];

  const [activeTab, setActiveTab] = useState("All");

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);

  // Completed, cancelled & rejected bookings of this provider
  const historyBookings = bookings
    .filter(
      (b) =>
        b.providerId === "PRV-0001" &&
        ["Completed", "Cancelled", "Rejected"].includes(b.status),
    )
    .sort((a, b) => getBookingDateTime(b) - getBookingDateTime(a));

  const tabCounts = {
    All: historyBookings.length,
    Completed: historyBookings.filter((b) => b.status === "Completed").length,
    Cancelled: historyBookings.filter((b) => b.status === "Cancelled").length,
    Rejected: historyBookings.filter((b) => b.status === "Rejected").length,
  };

  const displayedBookings = historyBookings
    .filter((b) => activeTab === "All" || b.status === activeTab)
    .filter((b) =>
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:px-15">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            Booking History
          </h1>
          <p className="text-gray-500 text-[13px] sm:text-sm mt-0.5">
            View your completed, cancelled, and rejected bookings.
          </p>
        </div>
        {/* Search */}
        <div className="relative w-full max-w-[13rem] sm:w-52 lg:w-56 shrink-0">
          <FiSearch
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-[12px] text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-50 transition-all duration-200 bg-white"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex mt-6 items-center gap-0 sm:gap-5 border-b border-gray-200 overflow-x-auto scrollbar-hide">
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

      {/* Bookings List */}
      <div className="mt-8">
        {displayedBookings.length === 0 ? (
          <EmptyState
            title="No booking history yet"
            description="Bookings completed, rejected by you, or cancelled by customers will appear here."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {displayedBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 transition hover:border-blue-300 hover:shadow-sm"
              >
                {/* customer + price */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">
                      {booking.customerName}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-gray-500">
                      {booking.serviceTitle}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <p className="font-bold text-gray-900">₹{booking.price}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${badgeStyles[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* schedule + area */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiCalendar size={12} /> {formatDate(booking.date)} at{" "}
                    {booking.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin size={12} /> {booking.address.split(",")[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Detail Modal (read-only) */}
      {selectedBooking && (
        <HistoryDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}

export default History;
