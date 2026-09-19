import { useCallback, useMemo, useState } from "react";
import { FiCalendar, FiEye, FiMapPin, FiSearch } from "react-icons/fi";
import { getAdminBookings } from "../../api/admin";
import AdminBookingDetailModal from "../../components/admin/BookingDetailModal";
import EmptyState from "../../components/ui/EmptyState";
import Loader, { ErrorState } from "../../components/ui/Loader";
import { useFetch } from "../../hooks/useFetch";
import formatDate from "../../utils/formatDate";
import getBookingDateTime from "../../utils/getBookingDateTime";
import { normalizeBooking } from "../../utils/normalize";

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-emerald-100 text-emerald-700",
  Completed: "bg-blue-100 text-blue-700",
  Cancelled: "bg-gray-100 text-gray-700",
  Rejected: "bg-red-100 text-red-700",
};

function BookingsPage() {
  const tabs = [
    "All",
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
    "Rejected",
  ];

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = useCallback(
    () =>
      getAdminBookings().then((res) =>
        res.data.bookings.map(normalizeBooking),
      ),
    [],
  );

  const {
    data: bookings,
    loading,
    error,
    refetch,
  } = useFetch(fetchBookings, { initialData: [] });

  const allBookings = useMemo(
    () =>
      [...(bookings || [])].sort(
        (a, b) => getBookingDateTime(b) - getBookingDateTime(a),
      ),
    [bookings],
  );

  const tabCounts = {
    All: allBookings.length,
    Pending: allBookings.filter((b) => b.status === "Pending").length,
    Confirmed: allBookings.filter((b) => b.status === "Confirmed").length,
    Completed: allBookings.filter((b) => b.status === "Completed").length,
    Cancelled: allBookings.filter((b) => b.status === "Cancelled").length,
    Rejected: allBookings.filter((b) => b.status === "Rejected").length,
  };

  const displayedBookings = allBookings
    .filter((b) => activeTab === "All" || b.status === activeTab)
    .filter((b) => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      return (
        b.customerName.toLowerCase().includes(query) ||
        b.providerName.toLowerCase().includes(query)
      );
    });

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:px-15">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            All Bookings
            <span className="rounded-full bg-blue-100 px-3 py-1 text-[12px] font-semibold text-blue-600">
              {allBookings.length}
            </span>
          </h1>
          <p className="text-gray-500 text-[13px] sm:text-sm mt-0.5">
            Review every booking across the platform.
          </p>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <FiSearch
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search customer or provider..."
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

      {/* Bookings Table  */}
      {loading && <Loader label="Loading bookings..." className="mt-8" />}

      {!loading && error && (
        <ErrorState message={error} onRetry={refetch} className="mt-8" />
      )}

      {!loading && !error && displayedBookings.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No bookings found"
            description="No bookings match your current search or status filter."
          />
        </div>
      ) : (
        !loading &&
        !error && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Booking ID
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Customer
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Service
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Provider
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Location
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Amount
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">
                    View
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-gray-100 last:border-0 transition hover:bg-blue-50/40"
                  >
                    <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-900 whitespace-nowrap">
                      {b.id}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] font-medium text-gray-800 whitespace-nowrap">
                      {b.customerName}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-600 whitespace-nowrap">
                      {b.serviceTitle}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-600 whitespace-nowrap">
                      {b.providerName}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-500 whitespace-nowrap">
                      {b.location}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-900 whitespace-nowrap">
                      ₹{b.price}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[b.status] || "bg-gray-100 text-gray-500"}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                      >
                        <FiEye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 flex flex-col gap-4 md:hidden">
            {displayedBookings.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">
                      {b.customerName}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {b.id} &bull; {b.serviceTitle}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[b.status] || "bg-gray-100 text-gray-500"}`}
                  >
                    {b.status}
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium text-gray-700">
                  {b.providerName}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiCalendar size={12} /> {formatDate(b.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin size={12} /> {b.location}
                  </span>
                  <span className="ml-auto font-bold text-gray-900">
                    ₹{b.price}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedBooking(b)}
                  className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  <FiEye size={15} /> View Details
                </button>
              </div>
            ))}
          </div>
        </>
        )
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <AdminBookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}

export default BookingsPage;
