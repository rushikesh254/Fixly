import { toast } from "sonner";
function CancelModal({ setShowCancelModal }) {
  // Update a booking's status in local state

  return (
    <div>
      {" "}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
        <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-gray-900">
            Cancel this service?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Are you sure you want to cancel this booking? This action cannot be
            undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowCancelModal(false)}
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Keep Booking
            </button>
            <button
              onClick={() => {
                setShowCancelModal(false);
                toast.success("Your booking has been cancelled successfully.");
              }}
              className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelModal;
