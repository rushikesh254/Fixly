import { useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi";
import bg from "../../assets/bg.svg";
import PrimaryBtn from "../ui/PrimaryBtn";
import Trust from "./Trust";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function HeroSection() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);
  // Get the search query from URL parameters
  const searchQuery = queryParams.get("q") || "";

  const [inputValue, setInputValue] = useState(searchQuery);

  return (
    <div className="w-full relative mb-28 sm:mb-24 md:mb-20">
      <div className="relative min-h-140 sm:min-h-155 md:h-[90vh] w-full overflow-hidden">
        <img
          src={bg}
          alt="Hero background"
          loading="lazy"
          className="absolute h-full w-full object-cover inset-0 brightness-75 contrast-110"
        />

        <div className="absolute inset-0 bg-linear-to-r from-black/80 to-black/30"></div>

        <div className="relative z-10 flex min-h-140 sm:min-h-155 md:h-full md:min-h-0 items-center justify-start px-8 sm:px-6 md:px-10 py-24 sm:py-28 md:py-0">
          <div className="text-white max-w-md sm:max-w-lg">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Book Trusted Home <span className="text-[#1E4ED8]">Service</span>{" "}
              Experts in Minutes
            </h1>
            <p className="my-4 mb-7 sm:my-5 sm:mb-10 text-sm sm:text-base leading-relaxed">
              From daily chores to urgent repairs, find trusted professionals
              near you. Book in minutes and enjoy reliable, hassle-free service
              at your doorstep.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const params = new URLSearchParams(search);
                if (inputValue) {
                  params.set("q", inputValue);
                } else {
                  params.delete("q");
                }
                navigate(`/services?${params.toString()}`);
              }}
              className="w-full"
            >
              <div className="w-full relative flex items-center mt-2">
                <input
                  {...register("service")}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  spellCheck="false"
                  className="w-full bg-black/20 border border-white/30 px-5 pr-18 sm:pr-20 backdrop-blur-md focus:outline-none transition-all focus:border-blue-400 hover:border-white/50 py-3 placeholder:text-gray-300 text-white text-sm rounded-full"
                  placeholder="Search services, providers or location..."
                />
                <div className="absolute right-1 sm:right-0.5 flex items-center">
                  <PrimaryBtn
                    btn={<FiSearch size={30} />}
                    className="rounded-r-full! px-4 sm:px-5 py-2 sm:py-2 flex items-center justify-center"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Trust />
    </div>
  );
}

export default HeroSection;
