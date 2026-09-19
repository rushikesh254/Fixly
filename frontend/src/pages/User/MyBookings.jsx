import { useCallback, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { getMyBookings } from "../../api/bookings";
import EmptyState from "../../components/ui/EmptyState";
import Loader, { ErrorState } from "../../components/ui/Loader";
import HorizontalCard from "../../components/user/HorizontalCard";
import { useFetch } from "../../hooks/useFetch";
import getBookingDateTime from "../../utils/getBookingDateTime";
import { normalizeBooking } from "../../utils/normalize";

// empty state copy per tab, keyed by the tab label
const EMPTY_STATES = {
  "All Bookings": {
    title: "No Bookings Yet",
    description:
      "You haven't booked any services yet. Explore services and schedule your first appointment.",
    buttonText: "Browse Services",
    buttonLink: "services",
  },
  Confirmed: {
    title: "No Confirmed Bookings",
    description:
      "You don't have any confirmed service appointments at the moment.",
    buttonText: "Browse Services",
    buttonLink: "services",
  },
  Pending: {
    title: "No Pending Bookings",
    description: "You don't have any booking requests awaiting confirmation.",
  },
  Completed: {
    title: "No Completed Services",
    description: "Your completed service history will appear here.",
  },
  Cancelled: {
    title: "No Cancelled Services",
    description: "Your cancelled service history will appear here.",
  },
  Rejected: {
    title: "No Rejected Requests",
    description: "Requests a provider could not take will appear here.",
  },
};

function MyBookings() {
  const tabs = [
    "All Bookings",
    "Confirmed",
    "Pending",
    "Completed",
    "Cancelled",
    "Rejected",
  ];
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("All Bookings");

  // State to track the search query
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBookings = useCallback(
    () =>
      getMyBookings().then((res) => res.data.bookings.map(normalizeBooking)),
    [],
  );

  const {
    data: userBookings,
    loading,
    error,
    refetch,
  } = useFetch(fetchBookings, { initialData: [] });

  // soonest first within every status
  const byStatus = useCallback(
    (status) =>
      (userBookings || [])
        .filter((booking) => booking.status === status)
        .sort((a, b) => getBookingDateTime(a) - getBookingDateTime(b)),
    [userBookings],
  );

  const bookingsByTab = useMemo(
    () => ({
      "All Bookings": [...(userBookings || [])].sort(
        (a, b) => getBookingDateTime(b) - getBookingDateTime(a),
      ),
      Confirmed: byStatus("Confirmed"),
      Pending: byStatus("Pending"),
      Completed: byStatus("Completed"),
      Cancelled: byStatus("Cancelled"),
      Rejected: byStatus("Rejected"),
    }),
    [userBookings, byStatus],
  );

  // Count of bookings for each tab
  const tabCounts = useMemo(
    () =>
      tabs.reduce((counts, tab) => {
        counts[tab] = bookingsByTab[tab].length;
        return counts;
      }, {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookingsByTab],
  );

  // Filter bookings based on search query
  const displayedBookings = bookingsByTab[activeTab].filter((booking) =>
    `${booking.serviceTitle} ${booking.providerName}`
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase()),
  );

  const emptyState = EMPTY_STATES[activeTab];

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Bookings list */}
        <div>
          {loading && <Loader label="Loading your bookings..." />}

          {!loading && error && (
            <ErrorState message={error} onRetry={refetch} />
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-5">
              {displayedBookings.length !== 0 ? (
                displayedBookings.map((booking) => (
                  <HorizontalCard
                    key={booking.id}
                    booking={booking}
                    onChanged={refetch}
                  />
                ))
              ) : (
                <EmptyState
                  title={emptyState.title}
                  description={emptyState.description}
                  buttonLink={emptyState.buttonLink}
                  buttonText={emptyState.buttonText}
                  className={`bg-blue-600 hover:bg-blue-700`}
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
