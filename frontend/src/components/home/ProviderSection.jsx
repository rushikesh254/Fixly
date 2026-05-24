import { MdEventAvailable, MdSchedule, MdTrendingUp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PrimaryBtn from "../ui/PrimaryBtn";

function ProviderSection() {
  const navigate = useNavigate();

  return (
    <div className="w-full md:min-h-[70vh] flex items-center justify-center py-8 sm:py-10 md:py-5 px-4 sm:px-5">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row justify-between items-stretch md:items-start w-full bg-[#0F2F66] rounded-2xl overflow-hidden md:pl-10 hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
        <div className="w-full md:w-1/2 p-5 sm:p-7 md:p-0 md:pr-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-50 mb-2 md:mt-10">
            Become a Provider
          </h1>
          <p className="text-sm sm:text-base text-gray-300 mb-6 md:mb-10">
            Start earning with your skills and take control of your time.
          </p>

          <div className="flex flex-col-reverse md:flex-row items-center w-full justify-between gap-6 md:gap-10">
            <div className="flex flex-col gap-1 w-full ">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50/80 transition-colors duration-200  group">
                <span className="w-8 h-8 shrink-0 rounded-full bg-blue-100 text-[#1E4ED8] flex items-center justify-center font-bold group-hover:bg-[#1E4ED8] group-hover:text-white transition-colors duration-200">
                  <MdEventAvailable className="text-base" aria-hidden="true" />
                </span>
                <p className="text-sm sm:text-base text-gray-300 font-medium group-hover:text-blue-900">
                  Get regular bookings
                </p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50/80 transition-colors duration-200  group">
                <span className="w-8 h-8 shrink-0 rounded-full bg-blue-100 text-[#1E4ED8] flex items-center justify-center font-bold group-hover:bg-[#1E4ED8] group-hover:text-white transition-colors duration-200">
                  <MdSchedule className="text-base" aria-hidden="true" />
                </span>
                <p className="text-sm sm:text-base text-gray-300 font-medium group-hover:text-blue-900">
                  Work on your own schedule
                </p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50/80 transition-colors duration-200  group">
                <span className="w-8 h-8 shrink-0 rounded-full bg-blue-100 text-[#1E4ED8] flex items-center justify-center font-bold group-hover:bg-[#1E4ED8] group-hover:text-white transition-colors duration-200">
                  <MdTrendingUp className="text-base" aria-hidden="true" />
                </span>
                <p className="text-sm sm:text-base text-gray-300 font-medium group-hover:text-blue-900">
                  Grow your income sustainably
                </p>
              </div>

              <PrimaryBtn
                onclick={() => {
                  navigate("/provider");
                }}
                btn="Join as a Provider"
                className="mt-5 ml-0 py-3 sm:ml-3 mb-4 bg-[#1E4ED8]"
              />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 md:rounded-r-2xl overflow-hidden shadow-lg cursor-pointer group">
          <img
            src="https://plus.unsplash.com/premium_photo-1664476872915-f3332ca961a6?q=80&w=600&auto=format&fit=crop"
            alt="Become a provider"
            loading="lazy"
            className="w-full h-40 sm:h-56 md:h-full object-cover transform group-hover:scale-105 transition-transform duration-500 brightness-75"
          />
        </div>
      </div>
    </div>
  );
}

export default ProviderSection;
