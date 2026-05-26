import { FaUserCheck } from "react-icons/fa";
import { TbUserCheck } from "react-icons/tb";
import { TiBriefcase } from "react-icons/ti";
import PrimaryBtn from "../ui/PrimaryBtn";

function ProviderCard({ provider }) {
  const expert = provider.provider || {};

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div className="relative">
          {/* provider image with fallback to default icon */}
          {expert.image ? (
            <img
              src={expert.image}
              alt={expert.name}
              className="h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-[#1E4ED8]">
              <FaUserCheck className="text-3xl" />
            </div>
          )}
        </div>
        {/* provider name, rating and experience */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">{expert.name}</h2>
          </div>

          <p className="mt-1 text-sm font-semibold text-gray-500">
            {provider.providerName}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
              <TiBriefcase />
              {expert.experience} Experience
            </span>

            <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              <TbUserCheck />
              Verified
            </span>
          </div>
        </div>
      </div>
      <div className="my-4 border-t border-gray-100"></div>
      <p className="text-sm leading-7 text-gray-600">{expert.bio}</p>
      {/* book now button */}
      <PrimaryBtn
        btn="Book Now"
        onclick={() => console.log("Book service")}
        className="mt-5 w-full py-3.5 text-base"
      />
    </div>
  );
}
export default ProviderCard;
