import { useForm } from "react-hook-form";
import { FiMapPin, FiSearch } from "react-icons/fi";
import bg from "../assets/bg.svg";
import PrimaryBtn from "./PrimaryBtn";
import Trust from "./Trust";

function HeroSection() {
  const { register, handleSubmit } = useForm();

  return (
    <div className=" w-full relative mb-20">
      <div className="relative h-[90vh] w-full overflow-hidden">
        <img
          src={bg}
          alt=""
          className="absolute h-full w-full object-cover inset-0 brightness-75 contrast-110"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30"></div>
        {/* Content */}
        <div className="relative z-10 flex  items-center justify-start h-full px-10">
          <div className="text-white max-w-md">
            <h1 className="text-5xl font-bold">
              Book Trusted Home Service Experts in Minutes
            </h1>
            <p className="my-5 mb-10">
              From daily chores to urgent repairs, find trusted professionals
              near you. Book in minutes and enjoy reliable, hassle-free service
              at your doorstep.
            </p>
            <form onSubmit={handleSubmit((data) => console.log(data))}>
              <div className="flex items-center bg-white rounded-xl mb-5 relative w-4/5 ">
                <FiSearch className="absolute  left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register("service")}
                  type="text"
                  spellCheck="false"
                  placeholder="Search for services(e.g. AC Repair...)"
                  className="w-full pl-10 ml-4  py-3 text-sm text-gray-800  focus:outline-none "
                />
              </div>
              <div className="flex items-center gap-3 mb-5 w-full">
                <div className="flex items-center bg-white rounded-xl relative w-5/12">
                  <FiMapPin className="absolute  left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("location")}
                    type="text"
                    spellCheck="false"
                    placeholder="Location"
                    className="w-full pl-10 ml-4  py-3 text-sm text-gray-800  focus:outline-none "
                  />
                </div>
                <PrimaryBtn btn="Find Services" />
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
