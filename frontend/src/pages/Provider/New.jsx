import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { getMyBookings, updateBookingStatus } from "../../api/bookings";
import EmptyState from "../../components/ui/EmptyState";
import Loader, { ErrorState } from "../../components/ui/Loader";
import RequestDetailModal from "../../components/provider/RequestDetailModal";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { useFetch } from "../../hooks/useFetch";
import { getApiErrorMessage } from "../../utils/apiError";
import getBookingDateTime from "../../utils/getBookingDateTime";
import formatDate from "../../utils/formatDate";
import { normalizeBooking } from "../../utils/normalize";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

function New() {
  const fetchBookings = useCallback(
    () =>
      getMyBookings().then((res) => res.data.bookings.map(normalizeBooking)),
    [],
  );

  const {
    data: myBookings,
    loading,
    error,
    refetch,
  } = useFetch(fetchBookings, { initialData: [] });

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [bookingToDecline, setBookingToDecline] = useState(null);

  //  only shows pending requests that have not passed yet
  const pendingRequests = useMemo(
    () =>
      (myBookings || [])
        .filter(
          (b) => b.status === "Pending" && getBookingDateTime(b) >= new Date(),
        )
        .sort((a, b) => getBookingDateTime(a) - getBookingDateTime(b)),
    [myBookings],
  );

  // Update a booking's status on the server, then reload the list
  const updateStatus = async (id, newStatus, successMessage) => {
    try {
      await updateBookingStatus(id, newStatus);
      toast.success(successMessage);
      refetch();
      return true;
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not update this request."));
      return false;
    }
  };

  const handleAccept = async (id) => {
    const done = await updateStatus(
      id,
      "confirmed",
      "Request accepted! Booking confirmed.",
    );
    if (done) setSelectedBooking(null);
  };

  const handleDecline = async () => {
    const done = await updateStatus(
      bookingToDecline.id,
      "rejected",
      "Request declined.",
    );
    if (done) setBookingToDecline(null);
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
          {loading && <Loader label="Loading requests..." />}
          {!loading && error && <ErrorState message={error} onRetry={refetch} />}
          {!loading && !error && pendingRequests.length === 0 ? (
            <EmptyState
              title="No new requests right now"
              description="When customers book your services, their requests will appear here."
              buttonText="Go to Dashboard"
              buttonLink="provider/dashboard"
              className="bg-blue-600 hover:bg-blue-700"
            />
          ) : (
            !loading &&
            !error &&
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
                    {formatDate(req.bookedAt)}
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
        <ConfirmDialog
          title="Decline this request?"
          message={
            <p>
              Are you sure you want to decline{" "}
              <span className="font-medium text-gray-900">
                {bookingToDecline.customerName}
              </span>
              's request?
            </p>
          }
          cancelLabel="Keep Request"
          confirmLabel="Yes, Decline"
          onCancel={() => setBookingToDecline(null)}
          onConfirm={handleDecline}
        />
      )}
    </div>
  );
}

export default New;
