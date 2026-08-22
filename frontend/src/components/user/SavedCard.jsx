import { useState } from "react";
import BookingCard from "./BookingCard";
import PrimaryBtn from "../ui/PrimaryBtn";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import SecondaryBtn from "../ui/SecondaryBtn";

function SavedCard({ booking }) {
  const { id, title, providerName, price, image } = booking;
  const [openBooking, setOpenBooking] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="bg-white hover:shadow-md  rounded-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            navigate(`/services/viewDetails/${id}`);
          }}
          className="w-full md:w-72 h-44 md:h-auto shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full md:h-[95%] object-cover"
          />
        </div>

        <div className="flex-1 p-2 sm:p-7 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>

              <p className="text-sm text-blue-600 mt-1">{providerName}</p>
            </div>

            <p className="text-xl sm:text-2xl font-bold">₹ {price}</p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <SecondaryBtn
                btn="View Details"
                className={`border border-gray-300! hover:border-gray-400! text-gray-600! hover:text-gray-700! hover:bg-gray-100!`}
                onclick={() => {
                  navigate(`/services/viewDetails/${id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
              <PrimaryBtn btn="Book Now" onclick={() => setOpenBooking(true)} />
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-50 hover:bg-slate-200 cursor-pointer transition duration-200 flex items-center justify-center">
              <FaTrash className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {openBooking && (
        <BookingCard setOpenBooking={setOpenBooking} service={booking} />
      )}
    </div>
  );
}

export default SavedCard;
