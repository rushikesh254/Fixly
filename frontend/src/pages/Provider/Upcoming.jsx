import { useState } from "react";
import { toast } from "sonner";
import bookings from "../../data/bookings";
import EmptyState from "../../components/ui/EmptyState";
import BookingDetailModal from "../../components/provider/BookingDetailModal";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import getBookingDateTime from "../../utils/getBookingDateTime";
import formatDate from "../../utils/formatDate";

function Upcoming() {
  //  copy of this provider's bookings
  const [myBookings, setMyBookings] = useState(
    bookings.filter((b) => b.providerId === "PRV-0001"),
  );

  const [selectedBooking, setSelectedBooking] = useState(null);

  // Update a booking's status
  const updateStatus = (id, newStatus) => {
    setMyBookings(
      myBookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
    );
  };

  // Completed bookings
  const handleComplete = () => {
    updateStatus(selectedBooking.id, "Completed");
    setSelectedBooking(null);
    toast.success("Booking marked as completed.");
  };

  // Reject Booking
  const handleReject = () => {
    updateStatus(selectedBooking.id, "Rejected");
    setSelectedBooking(null);
    toast.info("Booking rejected.");
  };

  // Only confirmed bookings that are still upcoming
  const upcomingBookings = myBookings
    .filter(
      (b) => b.status === "Confirmed" && getBookingDateTime(b) >= new Date(),
    )
    .sort((a, b) => getBookingDateTime(a) - getBookingDateTime(b));

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:px-15">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            Upcoming Bookings
          </h1>
          <p className="text-gray-500 text-[13px] sm:text-sm mt-0.5">
            Mark bookings as completed once the service is done.
          </p>
        </div>
        {/* Count badge */}
        <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1.5 text-xs sm:text-sm font-semibold text-blue-700">
          {upcomingBookings.length} Upcoming
        </span>
      </div>

      {/* Bookings List */}
      <div className="mt-8">
        {upcomingBookings.length === 0 ? (
          <EmptyState
            title="No upcoming bookings"
            description="When you will confirm bookings, they will appear here. You can mark them as completed once the service is done."
            buttonText="Go to Dashboard"
            buttonLink="provider/dashboard"
            className="bg-blue-600 hover:bg-blue-700"
          />
        ) : (
          <div className="flex flex-col gap-4">
            {upcomingBookings.map((booking) => (
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
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      Confirmed
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

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onComplete={handleComplete}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

export default Upcoming;
