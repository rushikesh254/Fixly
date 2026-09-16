import { FiArrowLeft } from "react-icons/fi";
import formatDate from "../../utils/formatDate";

const badgeStyles = {
  Pending: "bg-amber-50 text-amber-600",
  Confirmed: "bg-emerald-50 text-emerald-600",
  Completed: "bg-blue-50 text-blue-600",
  Cancelled: "bg-gray-50 text-gray-600",
  Rejected: "bg-red-50 text-red-600",
};

const accentStyles = {
  Pending: "bg-amber-500",
  Confirmed: "bg-emerald-500",
  Completed: "bg-blue-500",
  Cancelled: "bg-gray-500",
  Rejected: "bg-red-500",
};

function BookingDetailModal({ booking, onClose }) {
  const {
    id,
    status,
    customerName,
    customerPhone,
    customerEmail,
    serviceTitle,
    providerName,
    date,
    time,
    address,
    price,
    payment,
    specialInstructions,
    instruction,
  } = booking;

  const instructions = specialInstructions || instruction;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="h-1 shrink-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"></div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Booking Details
              </h2>
              <p className="text-xs text-slate-400">{id}</p>
            </div>
          </div>
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              badgeStyles[status] || "bg-slate-100 text-slate-500"
            }`}
          >
            {status}
          </span>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Customer */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span
                className={`w-1 h-5 rounded-full inline-block ${
                  accentStyles[status] || "bg-blue-600"
                }`}
              ></span>
              CUSTOMER DETAILS
            </h2>
            <div className="space-y-2.5 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Name</span>
                <span className="font-medium text-slate-800">
                  {customerName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phone Number</span>
                <span className="font-medium text-slate-800">
                  {customerPhone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-800">
                  {customerEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Service Address */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span
                className={`w-1 h-5 rounded-full inline-block ${
                  accentStyles[status] || "bg-blue-600"
                }`}
              ></span>
              SERVICE ADDRESS
            </h2>
            <p className="text-[12px] text-slate-700">{address}</p>
          </div>

          {/* Service Details */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span
                className={`w-1 h-5 rounded-full inline-block ${
                  accentStyles[status] || "bg-blue-600"
                }`}
              ></span>
              SERVICE DETAILS
            </h2>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Booking ID</span>
                <span className="font-medium text-slate-800">{id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Service</span>
                <span className="font-medium text-slate-800">
                  {serviceTitle}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Provider</span>
                <span className="font-medium text-slate-800">
                  {providerName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Price</span>
                <span className="font-medium text-slate-800">{`₹${price}`}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Payment Status</span>
                <span className="font-medium text-slate-800">
                  {payment?.status || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-medium text-slate-800">
                  {formatDate(date)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Time</span>
                <span className="font-medium text-slate-800">{time}</span>
              </div>
            </div>
          </div>

          {/* Customer Instruction */}
          <div className="px-5 py-4">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span
                className={`w-1 h-5 rounded-full inline-block ${
                  accentStyles[status] || "bg-blue-600"
                }`}
              ></span>
              CUSTOMER INSTRUCTION
            </h2>
            <p className="text-[12px] text-slate-700">
              {instructions || "No special instructions."}
            </p>
          </div>
        </div>

        {/* Close */}
        <div className="border-t border-slate-100 p-4 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailModal;
