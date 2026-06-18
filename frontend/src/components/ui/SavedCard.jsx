import { useState } from "react";
import BookingCard from "../service/BookingCard";
import PrimaryBtn from "./PrimaryBtn";
import SecondaryBtn from "./SecondaryBtn";

function SavedCard({ booking }) {
  const { title, providerName, price, image } = booking;
  const [openBooking, setOpenBooking] = useState(false);

  return (
    <div className="bg-white hover:shadow-md  rounded-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-72 h-44 md:h-auto shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full md:h-[90%] object-cover"
          />
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>

              <p className="text-sm text-blue-600 mt-1">{providerName}</p>
            </div>

            <p className="text-xl sm:text-2xl font-bold">₹ {price}</p>
          </div>

          <div className="flex gap-2.5 mt-4">
            <SecondaryBtn
              btn="Remove"
              className="text-red-600! border border-red-200!"
            />

            <PrimaryBtn btn="Book Now" onclick={() => setOpenBooking(true)} />
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
