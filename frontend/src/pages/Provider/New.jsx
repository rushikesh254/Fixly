import { useState } from "react";
import { toast } from "sonner";
import bookings from "../../data/bookings";
import EmptyState from "../../components/ui/EmptyState";
import RequestDetailModal from "../../components/provider/RequestDetailModal";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getBookingDateTime = (booking) => {
  const dateTime = new Date(booking.date);

  const [clock, period] = booking.time.split(" ");
  const [hours, minutes] = clock.split(":").map(Number);

  let hours24 = hours;

  if (period === "PM" && hours !== 12) {
    hours24 += 12;
  }

  if (period === "AM" && hours === 12) {
    hours24 = 0;
  }

  dateTime.setHours(hours24, minutes, 0, 0);

  return dateTime;
};

function New() {
  // copy of this provider's bookings
  const [myBookings, setMyBookings] = useState(
    bookings.filter((b) => b.providerId === "0"),
  );

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [bookingToDecline, setBookingToDecline] = useState(null);

  //  only shows pending requests
  const pendingRequests = myBookings
    .filter(
      (b) => b.status === "Pending" && getBookingDateTime(b) >= new Date(),
    )
    .sort((a, b) => {
      return getBookingDateTime(a) - getBookingDateTime(b);
    });

  // Update a booking's status
  const updateStatus = (id, newStatus) => {
    setMyBookings(
      myBookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
    );
  };
  const handleAccept = (id) => {
    updateStatus(id, "Confirmed");
    setSelectedBooking(null);
    toast.success("Request accepted! Booking confirmed.");
  };

  const handleDecline = () => {
    updateStatus(bookingToDecline.id, "Rejected");
    setBookingToDecline(null);
    toast.info("Request declined.");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:px-15">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            New Requests
          </h1>
          <p className="text-gray-500 text-[13px] sm:text-sm mt-0.5">
            Respond to incoming booking requests from customers.
          </p>
        </div>
        {/* Count badge */}
        <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1.5 text-xs sm:text-sm font-semibold text-amber-700">
          {pendingRequests.length} New
        </span>
      </div>

      {/* Requests List */}
      <div className="mt-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <span className="inline-block h-5 w-1 rounded-full bg-amber-500"></span>
          PENDING REQUESTS
        </h2>

        <div className="mt-5 flex flex-col gap-4">
          {pendingRequests.length === 0 ? (
            <EmptyState
              title="No new requests right now"
              description="When customers book your services, their requests will appear here."
              buttonText="Go to Dashboard"
              buttonLink="provider/dashboard"
              className="bg-blue-600 hover:bg-blue-700"
            />
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedBooking(req)}
                className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 transition hover:border-blue-300 hover:shadow-sm"
              >
                {/* customer + price */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">
                      {req.customerName}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-gray-500">
                      {req.serviceTitle}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <p className="font-bold text-gray-900">₹{req.price}</p>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      Pending
                    </span>
                  </div>
                </div>

                {/* schedule + area + requested on */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiCalendar size={12} /> {formatDate(req.date)} at{" "}
                    {req.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin size={12} /> {req.address.split(",")[0]}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock size={12} /> Requested on{" "}
                    {formatDate(req.requestedOn)}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex items-center justify-end gap-3 border-t border-dashed border-gray-200 pt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBookingToDecline(req);
                    }}
                    className="cursor-pointer rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 active:scale-95"
                  >
                    Decline
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(req.id);
                    }}
                    className="cursor-pointer rounded-xl bg-[#1E4ED8] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Request Detail Modal  */}
      {selectedBooking && (
        <RequestDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onAccept={() => handleAccept(selectedBooking.id)}
          onDecline={() => {
            setSelectedBooking(null);
            setBookingToDecline(selectedBooking);
          }}
        />
      )}

      {/* Decline Confirmation Modal */}
      {bookingToDecline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Decline this request?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to decline{" "}
              <span className="font-medium text-gray-900">
                {bookingToDecline.customerName}
              </span>
              's request?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setBookingToDecline(null)}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Keep Request
              </button>
              <button
                onClick={handleDecline}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Yes, Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default New;
