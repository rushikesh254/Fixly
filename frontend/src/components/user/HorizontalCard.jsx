import { useState } from "react";
import { FaStar, FaPhoneAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { LuClock2 } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import PrimaryBtn from "../ui/PrimaryBtn";
import SecondaryBtn from "../ui/SecondaryBtn";
import DetailModal from "./DetailModal";
import CancelModal from "./CancelModal";
import ReviewModal from "./ReviewModal";

function HorizontalCard({ booking }) {
  const {
    userAddress,
    serviceTitle,
    providerName,
    price,
    rating,
    totalReviews,
    date,
    time,
    status,
    image,
  } = booking;

  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const statusConfig = {
    Pending: {
      banner: "bg-amber-50 border-amber-200",
      bannerText: "text-amber-700",
      icon: "bg-amber-100 text-amber-600",
      message: "Awaiting Provider Confirmation",
      description:
        "Your booking request is waiting for the provider to accept.",
    },
    Confirmed: {
      banner: "bg-emerald-50 border-emerald-200",
      bannerText: "text-emerald-700",
      icon: "bg-emerald-100 text-emerald-600",
      message: "Booking Confirmed",
      description:
        "The provider has accepted your booking. You can contact them for any queries.",
    },
    Completed: {
      banner: "bg-blue-50 border-blue-200",
      bannerText: "text-blue-700",
      icon: "bg-blue-100 text-blue-600",
      message: "Service Completed",
      description: "This service has been completed successfully.",
    },
    Cancelled: {
      banner: "bg-slate-50 border-slate-200",
      bannerText: "text-slate-700",
      icon: "bg-slate-100 text-slate-600",
      message: "Booking Cancelled",
      description: "This booking was cancelled and cannot be restored.",
    },
    Rejected: {
      banner: "bg-red-50 border-red-200",
      bannerText: "text-red-700",
      icon: "bg-red-100 text-red-600",
      message: "Booking Rejected",
      description:
        "The provider was unable to take this booking. Try another provider.",
    },
  };

  const cfg = statusConfig[status] || statusConfig.Pending;

  return (
    <>
      <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-300">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate(`/services/viewDetails/${booking.providerId}`);
            }}
            className="relative w-full md:w-72 h-44 md:h-auto shrink-0 overflow-hidden cursor-pointer"
          >
            <img
              src={image}
              alt={serviceTitle}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* status badge */}
            <span
              className={`absolute top-3 left-3 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm ${
                status === "Rejected"
                  ? "bg-red-500/90"
                  : status === "Completed"
                    ? "bg-blue-500/90"
                    : status === "Confirmed"
                      ? "bg-emerald-500/90"
                      : status === "Cancelled"
                        ? "bg-slate-500/90"
                        : status === "Pending"
                          ? "bg-amber-500/90"
                          : "bg-slate-500/90"
              }`}
            >
              {status}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div className="border-b my-3 border-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 leading-snug">
                    {serviceTitle}
                  </h3>

                  <div className="flex items-center gap-1.5 mt-1 mb-3 text-[13px]">
                    <span className="text-blue-600 font-medium">
                      {providerName}
                    </span>

                    <span className="text-slate-300">•</span>

                    <span className="text-amber-400">
                      <FaStar size={13} />
                    </span>

                    <span className="text-slate-600">{rating}</span>
                    <span className="text-slate-500">({totalReviews})</span>
                  </div>
                </div>

                <p className="text-xl sm:text-2xl font-bold text-slate-900 shrink-0">
                  ₹ {price}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] sm:text-[13px] text-slate-500  mb-5">
                <span className="flex items-center gap-1.5">
                  <IoLocationOutline size={15} />
                  <span>{userAddress.split(",")[0]}</span>
                </span>

                <span className="flex items-center gap-1.5">
                  <LuClock2 size={15} />
                  <span>{time}</span>
                </span>

                <span className="flex items-center gap-1.5">
                  <SlCalender size={14} />
                  <span>{date}</span>
                </span>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 ">
                {(status === "Confirmed" || status === "Pending") && (
                  <SecondaryBtn
                    btn="Cancel"
                    className="text-red-600! border border-red-200! hover:bg-red-50!"
                    onclick={() => setShowCancelModal(true)}
                  />
                )}

                {status === "Completed" && (
                  <SecondaryBtn
                    btn="Rate Now"
                    className="text-amber-600! border border-amber-300! hover:bg-amber-50!"
                    onclick={() => setShowReviewModal(true)}
                  />
                )}

                {(status === "Cancelled" || status === "Rejected") && (
                  <SecondaryBtn
                    btn="Book Again"
                    className="text-emerald-600! border border-emerald-400! hover:bg-emerald-50!"
                    onclick={() => {
navigate(`/services/viewDetails/${booking.providerId}`);
                    }}
                  />
                )}

                <PrimaryBtn
                  btn="Details"
                  onclick={() => {
                    setShowDetailModal(true);
                  }}
                />
              </div>
              {/* If Confirmed , then only Call */}
              {status === "Confirmed" && (
                <div className="flex items-center gap-2">
                  <div className="h-10 px-3 bg-slate-100 flex items-center gap-2 justify-center rounded-full cursor-pointer hover:bg-blue-50 transition duration-300 group/call">
                    <FaPhoneAlt
                      size={15}
                      className="text-slate-500 transition-colors duration-300 group-hover/call:text-blue-600"
                    />
                    <span className="text-[13px] font-medium text-slate-500 transition-colors duration-300 group-hover/call:text-blue-600">
                      Call Provider
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal
          setShowReviewModal={setShowReviewModal}
          providerName={providerName}
        />
      )}
      {/* Cancel Modal */}
      {showCancelModal && (
        <CancelModal setShowCancelModal={setShowCancelModal} />
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <DetailModal
          showDetailModal={showDetailModal}
          setShowDetailModal={setShowDetailModal}
          setShowCancelModal={setShowCancelModal}
          booking={booking}
          cfg={cfg}
        />
      )}
    </>
  );
}

export default HorizontalCard;
