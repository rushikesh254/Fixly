import { FaStar, FaPhoneAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { LuClock2 } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import PrimaryBtn from "./PrimaryBtn";
import SecondaryBtn from "./SecondaryBtn";
import { useState } from "react";

function HorizontalCard({ booking }) {
  const {
    id,
    userAddress,
    title,
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

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-300">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-72 h-44 md:h-auto shrink-0 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

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
                  {title}
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
                />
              )}

              {status === "Completed" && (
                <SecondaryBtn
                  btn="Review"
                  className="text-amber-600! border border-amber-300! hover:bg-amber-50!"
                />
              )}

              {(status === "Cancelled" || status === "Rejected") && (
                <SecondaryBtn
                  btn="Book Again"
                  className="text-green-600! border border-green-300! hover:bg-green-50!"
                  onclick={() => {
                    navigate(`/services/viewDetails/${id}`);
                  }}
                />
              )}

              <PrimaryBtn
                btn="Details"
                onclick={() => {
                  navigate("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
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
  );
}

export default HorizontalCard;
