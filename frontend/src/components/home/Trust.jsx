import { FaStar } from "react-icons/fa";

function Trust() {
  return (
    <div
      className="
      absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
       sm:w-[90%] md:w-[60%] max-w-4xl
      grid grid-cols-2 gap-y-4 sm:flex sm:items-center sm:justify-between
      bg-[#1E4ED8]
      rounded-2xl
      px-4 sm:px-6 md:px-10 py-4 md:py-5
      shadow-2xl z-20
    "
    >
      <div className="flex flex-col items-center flex-1">
        <h1 className="text-xl sm:text-2xl text-white font-bold">5K+</h1>
        <p className="text-center text-xs md:text-sm text-blue-200">
          Services Completed
        </p>
      </div>

      <div className="hidden md:block w-px h-10 bg-blue-300/40" />

      <div className="flex flex-col items-center flex-1">
        <h1 className="text-xl sm:text-2xl text-white font-bold">2K+</h1>
        <p className="text-center text-xs md:text-sm text-blue-200">
          Happy Customers
        </p>
      </div>

      <div className="hidden md:block w-px h-10 bg-blue-300/40" />

      <div className="flex flex-col items-center flex-1">
        <h1 className="text-xl sm:text-2xl text-white font-bold">100+</h1>
        <p className="text-center text-xs md:text-sm text-blue-200">
          Verified Professionals
        </p>
      </div>

      <div className="hidden md:block w-px h-10 bg-blue-300/40" />

      <div className="flex flex-col items-center flex-1">
        <h1 className="text-2xl text-white font-bold flex items-center justify-center gap-1">
          4.8 <FaStar aria-hidden="true" className="text-amber-300" />
        </h1>
        <p className="text-center text-xs md:text-sm text-blue-200">
          Average Rating
        </p>
      </div>
    </div>
  );
}

export default Trust;
