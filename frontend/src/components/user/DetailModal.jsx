import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { CiCircleCheck } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import PrimaryBtn from "../ui/PrimaryBtn";
import SecondaryBtn from "../ui/SecondaryBtn";
import { GiSandsOfTime } from "react-icons/gi";
import { useAuth } from "../../context/AuthContext";

function DetailModal({
  showDetailModal,
  setShowDetailModal,
  setShowCancelModal,
  booking,
  cfg,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    id,
    title,
    providerName,
    price,
    status,
    userAddress,
    date,
    time,
    estimatedTime,
    customer,
    payment,
    bookedAt,
    cancelledAt,
    rejectedAt,
    instruction,
  } = booking;

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!showDetailModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDetailModal(false)}
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
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              status === "Rejected"
                ? "bg-red-50 text-red-600"
                : status === "Completed"
                  ? "bg-blue-50 text-blue-600"
                  : status === "Confirmed"
                    ? "bg-emerald-50 text-emerald-600"
                    : status === "Cancelled"
                      ? "bg-slate-100 text-slate-400"
                      : "bg-amber-50 text-amber-600"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Status Banner */}
          <div className={`px-5 py-3 ${cfg.banner}`}>
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm ${cfg.icon}`}
              >
                {status === "Confirmed" || status === "Completed" ? (
                  <CiCircleCheck />
                ) : status === "Pending" ? (
                  <GiSandsOfTime />
                ) : (
                  <RxCross1 />
                )}
              </div>
              <div>
                <p className={`text-[12px] font-semibold ${cfg.bannerText}`}>
                  {cfg.message}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {cfg.description}
                </p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px]  flex items-center gap-2 mb-3">
              <span
                className={`w-1 h-5 rounded-full  inline-block ${
                  status === "Confirmed"
                    ? "bg-emerald-600"
                    : status == "Pending"
                      ? "bg-amber-600"
                      : status == "Cancelled"
                        ? "bg-slate-400"
                        : status == "Completed"
                          ? "bg-blue-600"
                          : status == "Rejected"
                            ? "bg-red-600"
                            : ""
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
                <span className="font-medium text-slate-800">{date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Time</span>
                <span className="font-medium text-slate-800">{time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Duration</span>
                <span className="font-medium text-slate-800">
                  {estimatedTime}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {customer && (
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-[13px]  flex items-center gap-2 mb-3">
                <span
                  className={`w-1 h-5 rounded-full  inline-block ${
                    status === "Confirmed"
                      ? "bg-emerald-600"
                      : status == "Pending"
                        ? "bg-amber-600"
                        : status == "Cancelled"
                          ? "bg-slate-400"
                          : status == "Completed"
                            ? "bg-blue-600"
                            : status == "Rejected"
                              ? "bg-red-600"
                              : ""
                  }`}
                ></span>
                YOUR INFORMATION
              </h2>
              <div className="space-y-2 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Name</span>
                  <span className="font-medium text-slate-800">
                    {user.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium text-slate-800">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Phone Number</span>
                  <span className="font-medium text-slate-800">
                    {user.phoneNumber}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Address */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px]  flex items-center gap-2 mb-3">
              <span
                className={`w-1 h-5 rounded-full  inline-block ${
                  status === "Confirmed"
                    ? "bg-emerald-600"
                    : status == "Pending"
                      ? "bg-amber-600"
                      : status == "Cancelled"
                        ? "bg-slate-400"
                        : status == "Completed"
                          ? "bg-blue-600"
                          : status == "Rejected"
                            ? "bg-red-600"
                            : ""
                }`}
              ></span>
              SERVICE ADDRESS
            </h2>
            <p className="text-[12px] text-slate-700">{userAddress}</p>
          </div>

          {/* Instructions */}
          {instruction && (
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
                <span
                  className={`w-1 h-5 rounded-full inline-block ${
                    status === "Confirmed"
                      ? "bg-emerald-600"
                      : status == "Pending"
                        ? "bg-amber-600"
                        : status == "Cancelled"
                          ? "bg-slate-400"
                          : status == "Completed"
                            ? "bg-blue-600"
                            : status == "Rejected"
                              ? "bg-red-600"
                              : ""
                  }`}
                ></span>
                INSTRUCTIONS
              </h2>
              <p className="text-[12px] text-slate-700">{instruction}</p>
            </div>
          )}

          {/* Payment */}
          {payment && (
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-[13px]  flex items-center gap-2 mb-3">
                <span
                  className={`w-1 h-5 rounded-full  inline-block ${
                    status === "Confirmed"
                      ? "bg-emerald-600"
                      : status == "Pending"
                        ? "bg-amber-600"
                        : status == "Cancelled"
                          ? "bg-slate-400"
                          : status == "Completed"
                            ? "bg-blue-600"
                            : status == "Rejected"
                              ? "bg-red-600"
                              : ""
                  }`}
                ></span>
                PAYMENT
              </h2>
              <div className="space-y-2 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-medium text-slate-800">
                    ₹ {payment.amount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status</span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      payment.status === "Paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Booking Timeline */}
          <div className="px-5 py-4">
            <h2 className="font-semibold text-[13px]  flex items-center gap-2 mb-3">
              <span
                className={`w-1 h-5 rounded-full  inline-block ${
                  status === "Confirmed"
                    ? "bg-emerald-600"
                    : status == "Pending"
                      ? "bg-amber-600"
                      : status == "Cancelled"
                        ? "bg-slate-400"
                        : status == "Completed"
                          ? "bg-blue-600"
                          : status == "Rejected"
                            ? "bg-red-600"
                            : ""
                }`}
              ></span>
              BOOKING TIMELINE
            </h2>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Booked on</span>
                <span className="text-slate-700">
                  {formatDate(bookedAt)} at {formatTime(bookedAt)}
                </span>
              </div>
              {cancelledAt && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Cancelled on</span>
                  <span className="text-red-600">
                    {formatDate(cancelledAt)} at {formatTime(cancelledAt)}
                  </span>
                </div>
              )}
              {rejectedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Rejected on</span>
                  <span className="text-red-600">
                    {formatDate(rejectedAt)} at {formatTime(rejectedAt)}
                  </span>
                </div>
              )}
              {status === "Completed" && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Completed on</span>
                  <span className="text-blue-600">{date}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-slate-100 p-4 flex items-center justify-end gap-3">
            {status === "Pending" && (
              <div className="flex gap-3">
                <SecondaryBtn
                  btn="Cancel Booking"
                  className="text-red-600! border border-red-200! hover:bg-red-50! py-3"
                  onclick={() => {
                    setShowDetailModal(false);
                    setShowCancelModal(true);
                  }}
                />
              </div>
            )}
            {status === "Confirmed" && (
              <div className="flex gap-3">
                <SecondaryBtn
                  btn="Cancel Booking"
                  className="text-red-600! border border-red-200! hover:bg-red-50! py-3"
                  onclick={() => {
                    setShowDetailModal(false);
                    setShowCancelModal(true);
                  }}
                />
                <PrimaryBtn
                  btn="Call Provider"
                  onclick={() => setShowDetailModal(false)}
                  className="py-3"
                />
              </div>
            )}
            {status === "Completed" && (
              <div className="flex gap-3">
                <SecondaryBtn
                  btn="Book Again"
                  className="text-blue-600! border border-blue-200! hover:bg-blue-50! py-3"
                  onclick={() => {
                    setShowDetailModal(false);
navigate(`/services/viewDetails/${booking.providerId}`);
                  }}
                />
                <PrimaryBtn
                  btn="Leave Review"
                  onclick={() => setShowDetailModal(false)}
                  className="flex-1 py-3"
                />
              </div>
            )}
            {status === "Cancelled" && (
              <PrimaryBtn
                btn="Book Again"
                onclick={() => {
                  setShowDetailModal(false);
                  navigate(`/services/viewDetails/${booking.providerId}`);
                }}
                className="px-5 py-3"
              />
            )}
            {status === "Rejected" && (
              <PrimaryBtn
                btn="Book Again"
                onclick={() => {
                  setShowDetailModal(false);
                  navigate(`/services/viewDetails/${booking.providerId}`);
                }}
                className="py-3 px-5"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
