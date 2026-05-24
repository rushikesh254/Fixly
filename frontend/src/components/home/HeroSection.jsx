import { useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi";
import bg from "../../assets/bg.svg";
import PrimaryBtn from "../ui/PrimaryBtn";
import Trust from "./Trust";

function HeroSection() {
  const { register, handleSubmit } = useForm();

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

        <div className="relative z-10 flex min-h-140 sm:min-h-155 md:h-full md:min-h-0 items-center justify-start px-4 sm:px-6 md:px-10 py-24 sm:py-28 md:py-0">
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
              onSubmit={handleSubmit((data) => console.log(data))}
              className="w-full"
            >
              <div className="w-full relative flex items-center mt-2">
                <input
                  {...register("service")}
                  type="text"
                  spellCheck="false"
                  className="w-full bg-black/20 border border-white/30 px-5 pr-18 sm:pr-20 backdrop-blur-md focus:outline-none transition-all focus:border-blue-400 hover:border-white/50 py-3 placeholder:text-gray-300 text-white text-sm rounded-full"
                  placeholder="What service do you need ?"
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
