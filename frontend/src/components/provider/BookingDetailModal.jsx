import { FiArrowLeft, FiCheckCircle, FiPhone } from "react-icons/fi";
import PrimaryBtn from "../ui/PrimaryBtn";
import SecondaryBtn from "../ui/SecondaryBtn";
import formatDate from "../../utils/formatDate";

function BookingDetailModal({ booking, onClose, onComplete, onReject }) {
  const {
    id,
    customerName,
    customerPhone,
    customerEmail,
    serviceTitle,
    date,
    time,
    address,
    price,
    specialInstructions,
  } = booking;

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
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
            Confirmed
          </span>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Status Banner */}
          <div className="px-5 py-3 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm bg-blue-100 text-blue-600">
                <FiCheckCircle />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-blue-700">
                  Confirmed Booking
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {customerName} is expecting you on {formatDate(date)} at{" "}
                  {time}.
                </p>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded-full inline-block bg-blue-600"></span>
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
                <span className="flex items-center gap-2">
                  <span className="font-medium text-slate-800">
                    {customerPhone}
                  </span>
                  {/* tap to call the customer */}
                  <a
                    href={`tel:${customerPhone.replace(/\s/g, "")}`}
                    aria-label={`Call ${customerName}`}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 active:scale-90"
                  >
                    <FiPhone size={13} />
                  </a>
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
              <span className="w-1 h-5 rounded-full inline-block bg-blue-600"></span>
              SERVICE ADDRESS
            </h2>
            <p className="text-[12px] text-slate-700">{address}</p>
          </div>

          {/* Service Details */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded-full inline-block bg-blue-600"></span>
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
          <div className="px-5 py-4">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded-full inline-block bg-blue-600"></span>
              SPECIAL INSTRUCTIONS
            </h2>
            <p className="text-[12px] text-slate-700">
              {specialInstructions || "No special instructions."}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="border-t border-slate-100 p-4 flex gap-5 items-center justify-end shrink-0">
          <SecondaryBtn
            btn="Reject"
            onclick={onReject}
            className="py-3 border-2 border-red-300! text-red-500! hover:bg-red-50! hover:text-red-600!"
          />
          <PrimaryBtn
            btn="Mark as Completed"
            onclick={onComplete}
            className="py-3"
          />
        </div>
      </div>
    </div>
  );
}

export default BookingDetailModal;
