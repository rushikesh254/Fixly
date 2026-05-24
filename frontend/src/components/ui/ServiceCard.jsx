import { LuMapPinned } from "react-icons/lu";
import PrimaryBtn from "./PrimaryBtn";
import SecondaryBtn from "./SecondaryBtn";

export default function ServiceCard({
  providerName,
  service,
  image,
  rating,
  location,
  price,
  tag,
}) {
  return (
    <div className="group w-full max-w-[18rem] bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={image}
          alt={providerName}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {tag && (
          <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur px-3 py-1 text-xs text-white rounded-full">
            {tag}
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        {/* Provider Name + Rating */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {providerName}
          </h3>

          <span className="flex items-center gap-1 text-sm font-medium text-yellow-500">
            ⭐ <span className="text-gray-700">{rating}</span>
          </span>
        </div>

        {/* Service Name */}
        <p className="text-sm text-blue-600 font-medium">{service}</p>

        <p className="text-sm text-gray-500">
          Professional service by verified experts near you.
        </p>

        {/* Location + Price */}
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-gray-600">
            <LuMapPinned className="inline-block mr-1 w-4 h-4  " /> {location}
          </span>
          <span className="text-blue-600 font-semibold">₹{price}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          <div className="w-1/2">
            <SecondaryBtn
              btn="View"
              className="w-full text-blue-700! active:bg-[#1E4ED8]! border-[#1E4ED8]!  active:text-white! transition-colors duration-300 active:border-blue-800!"
            />
          </div>
          <div className="w-1/2">
            <PrimaryBtn btn="Book Now" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
