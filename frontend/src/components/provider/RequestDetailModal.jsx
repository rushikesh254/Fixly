import { FiArrowLeft } from "react-icons/fi";
import { GiSandsOfTime } from "react-icons/gi";
import PrimaryBtn from "../ui/PrimaryBtn";
import SecondaryBtn from "../ui/SecondaryBtn";

function RequestDetailModal({ booking, onClose, onAccept, onDecline }) {
  const {
    id,
    customerName,
    customerEmail,
    serviceTitle,
    date,
    time,
    address,
    price,
    specialInstructions,
  } = booking;

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
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
                {customerName}
              </h2>
              <p className="text-xs text-slate-500">{serviceTitle}</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">
            Pending
          </span>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Status Banner */}
          <div className="px-5 py-3 bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm bg-amber-100 text-amber-600">
                <GiSandsOfTime />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-amber-700">
                  New Booking Request
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {customerName} is waiting for your confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded-full inline-block bg-amber-600"></span>
              CUSTOMER DETAILS
            </h2>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Name</span>
                <span className="font-medium text-slate-800">
                  {customerName}
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
              <span className="w-1 h-5 rounded-full inline-block bg-amber-600"></span>
              SERVICE ADDRESS
            </h2>
            <p className="text-[12px] text-slate-700">{address}</p>
          </div>

          {/* Service Details */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded-full inline-block bg-amber-600"></span>
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
                <span className="text-slate-500">Price</span>
                <span className="font-medium text-slate-800">₹ {price}</span>
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

          {/* Special Instructions */}
          {specialInstructions && (
            <div className="px-5 py-4">
              <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
                <span className="w-1 h-5 rounded-full inline-block bg-amber-600"></span>
                SPECIAL INSTRUCTIONS
              </h2>
              <p className="text-[12px] text-slate-700">
                {specialInstructions}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-slate-100 p-4 flex items-center justify-end gap-3 shrink-0">
          <SecondaryBtn
            btn="Decline"
            className="text-red-600! border border-red-200! hover:bg-red-50! py-3"
            onclick={onDecline}
          />
          <PrimaryBtn btn="Accept" onclick={onAccept} className="py-3" />
        </div>
      </div>
    </div>
  );
}

export default RequestDetailModal;
