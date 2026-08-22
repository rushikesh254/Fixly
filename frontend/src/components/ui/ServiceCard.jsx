import { FaStar } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { MdElectricBolt } from "react-icons/md";
import { Link } from "react-router-dom";
import SaveBtn from "../user/SaveBtn";
import PrimaryBtn from "./PrimaryBtn";
import SecondaryBtn from "./SecondaryBtn";
import { useState } from "react";
import BookingCard from "../user/BookingCard";

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

  const [openBooking, setOpenBooking] = useState(false);

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
        <SaveBtn />
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
            <Link
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              to={`/services/viewDetails/${service.id}`}
            >
              <SecondaryBtn
                btn="View"
                className="w-full text-blue-700! active:bg-[#1E4ED8]! border-[#1E4ED8]!  hover:text-white! transition-colors duration-400 hover:bg-[#1E4ED8]! hover:border-[#1E4ED8]!"
              />
            </Link>
          </div>
          <div className="w-1/2">
            <PrimaryBtn
              btn="Book Now"
              className="w-full"
              onclick={() => setOpenBooking(true)}
            />
          </div>
          {openBooking && (
            <BookingCard setOpenBooking={setOpenBooking} service={service} />
          )}
        </div>
      </div>
    </div>
  );
}
