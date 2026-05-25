import { useState } from "react";
import { FaBookmark, FaRegBookmark, FaStar } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { MdElectricBolt } from "react-icons/md";
import { Link } from "react-router-dom";
import PrimaryBtn from "../ui/PrimaryBtn";
import SecondaryBtn from "../ui/SecondaryBtn";

export default function ServiceCard({ service }) {
  const {
    providerName,
    title,
    rating,
    location,
    price,
    coverImage,
    instantBooking,
    distance,
  } = service;

  const [showToast, setShowToast] = useState(false);

  const handleBookmarkClick = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 1500);
  };

  return (
    <div className="group max-w-95  h-full w-full  bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
      <div className="relative ">
        <div className="absolute inset-0 bg-gradient-to-top from-black/20 to-transparent" />
        {coverImage && (
          <img
            loading="lazy"
            src={coverImage}
            alt={providerName}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {instantBooking && (
          <span
            className="
            absolute top-4 left-4
            inline-flex items-center gap-1.5 rounded-full bg-amber-500/90 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white shadow-lg shadow-amber-900/20 ring-1 ring-white/15  transition-all duration-200 "
          >
            <MdElectricBolt className="text-[11px]" />
            Instant Booking
          </span>
        )}

        <div
          onClick={handleBookmarkClick}
          className="absolute h-9 w-9 z-10 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 shadow-md right-3 top-3 cursor-pointer flex items-center justify-center text-gray-200 hover:text-white hover:bg-gray-800/70 transition-all duration-200 group/btn"
        >
          <FaRegBookmark className="group-hover/btn:scale-105" />
          <span className="absolute top-11 right-0 w-max bg-gray-800 text-gray-100 font-medium text-xs px-3 py-1.5 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg z-20 border border-gray-600">
            Save for later
          </span>
        </div>

        {showToast && (
          <div className="absolute top-5 right-5 -translate-x-1/2 bg-gray-300 text-gray-500 text-sm px-4 py-1 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-bounce">
            <FaBookmark className="text-gray-500" />
            <span>Saved</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-1">
        {/* Provider Name + Rating */}
        <div className="flex justify-between items-center">
          <h3 className="text-medium font-semibold text-gray-800">
            {providerName}
          </h3>

          <span className="flex items-center gap-1 text-sm font-medium text-yellow-500">
            <FaStar className="text-yellow-400" aria-hidden="true" />
            <span className="text-gray-700">{rating}</span>
          </span>
        </div>

        {/* Service Name */}
        <p className="text-[13px] text-blue-600 font-medium mb-5">{title}</p>

        {/* Location + startingPrice */}
        <div className="flex justify-between items-center text-[12px] mt-2">
          <span className="text-gray-600">
            <FiMapPin className="inline-block w-4 h-4" /> {location}
            {distance !== undefined && (
              <>
                <span className="text-gray-500 px-2">•</span>
                {distance.toFixed(0)} km away
              </>
            )}
          </span>
          <span className="text-blue-600 font-semibold">₹{price}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 items-center mt-2">
          <div className="w-1/2">
            <Link>
              <SecondaryBtn
                btn="View"
                className="w-full text-blue-700! active:bg-[#1E4ED8]! border-[#1E4ED8]!  hover:text-white! transition-colors duration-400 hover:bg-[#1E4ED8]! hover:border-[#1E4ED8]!"
              />
            </Link>
          </div>
          <div className="w-1/2">
            <PrimaryBtn btn="Book Now" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
