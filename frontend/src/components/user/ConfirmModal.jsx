import { FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import PrimaryBtn from "../ui/PrimaryBtn";
import SecondaryBtn from "../ui/SecondaryBtn";
import { toast } from "sonner";
import formatDate from "../../utils/formatDate";

function ConfirmModal({
  setConfirmModalOpen,
  setOpenBooking,
  service,
  formData,
}) {
  const { user } = useAuth();

  const { title, providerName, price, estimatedDuration } = service;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {title}
              </h2>
              <p className="text-xs text-slate-500">{providerName}</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">
            Confirm Booking
          </span>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Service Details */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded-full inline-block bg-amber-600"></span>
              SERVICE DETAILS
            </h2>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Service</span>
                <span className="font-medium text-slate-800">{title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Provider</span>
                <span className="font-medium text-slate-800">
                  {providerName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Price</span>
                <span className="font-medium text-slate-800">₹ {price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-medium text-slate-800">
                  {formatDate(formData.date)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Time</span>
                <span className="font-medium text-slate-800">
                  {formData.time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Duration</span>
                <span className="font-medium text-slate-800">
                  {estimatedDuration}
                </span>
              </div>
            </div>
          </div>

          {/* Your Information */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded-full inline-block bg-amber-600"></span>
              YOUR INFORMATION
            </h2>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Name</span>
                <span className="font-medium text-slate-800">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-800">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phone Number</span>
                <span className="font-medium text-slate-800">
                  {user.phoneNumber}
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
            <p className="text-[12px] text-slate-700">{formData.where}</p>
          </div>

          {/* Instructions */}
          {formData.additional && (
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
                <span className="w-1 h-5 rounded-full inline-block bg-amber-600"></span>
                INSTRUCTIONS
              </h2>
              <p className="text-[12px] text-slate-700">
                {formData.additional}
              </p>
            </div>
          )}

          {/* Payment */}
          <div className="px-5 py-4">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded-full inline-block bg-amber-600"></span>
              PAYMENT
            </h2>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Amount</span>
                <span className="font-medium text-slate-800">₹ {price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                  To Pay
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-slate-100 p-4 flex items-center justify-end gap-3">
            <SecondaryBtn
              btn="Cancel"
              className="text-slate-600! border border-slate-200! hover:bg-slate-50! py-3"
              onclick={() => {
                setConfirmModalOpen(false);
                setOpenBooking(false);
              }}
            />
            <PrimaryBtn
              btn="Confirm Booking"
              onclick={() => {
                setConfirmModalOpen(false);
                setOpenBooking(false);
                toast.success("Booking confirmed successfully!");
              }}
              className="py-3 bg-emerald-500 hover:bg-emerald-600 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
