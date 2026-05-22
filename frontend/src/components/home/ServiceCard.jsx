import { FaLocationDot, FaStar } from "react-icons/fa6";
import PrimaryBtn from "../ui/PrimaryBtn";

export default function ServiceCard() {
  return (
    <div className="group w-72 shrink-0 snap-start bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952"
          alt="Home Cleaning"
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <span className="absolute top-3 left-3 bg-[#1E4ED8] text-white text-xs px-3 py-1 rounded-full">
          Popular
        </span>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Home Cleaning</h3>
          <span className="flex items-center gap-1 text-sm text-yellow-500 font-medium">
            <FaStar aria-hidden="true" /> 4.8
          </span>
        </div>

        <p className="text-sm text-gray-500">
          Professional deep cleaning for your home and office.
        </p>

        <div className="flex justify-between items-center text-sm mt-2">
          <span className="flex items-center gap-1 text-gray-600">
            <FaLocationDot aria-hidden="true" /> Delhi
          </span>
          <span className="text-blue-600 font-semibold">₹499</span>
        </div>

        <PrimaryBtn btn="Book Now" className="w-full mt-3" />
      </div>
    </div>
  );
}
