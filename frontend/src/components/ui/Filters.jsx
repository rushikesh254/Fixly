import { useState } from "react";
import { FiMapPin, FiMenu, FiX } from "react-icons/fi";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { RiResetRightLine } from "react-icons/ri";

function Filters(props) {
  const {
    status,
    detect,
    clearLocation,
    minPrice,
    selectedPrice,
    maxPrice,
    search,
    navigate,
    instantBookingEnabled,
    availableTodayEnabled,
    selectedRating,
    isCategoryExpanded,
    setIsCategoryExpanded,
    isServiceExpanded,
    setIsServiceExpanded,
    selectedCategory,
    categories,
    servicesInCategory,
    selectedServices,
  } = props;

  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-2   left-0 z-50 bg-white p-2 rounded-r-lg shadow-md border border-gray-200"
        onClick={() => setNavbarOpen(!navbarOpen)}
      >
        {navbarOpen ? (
          <FiX
            size={24}
            className="text-gray-800 hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <FiMenu
            size={24}
            className="text-gray-800 hover:scale-105 transition-transform duration-300"
          />
        )}
      </button>

      {/* Sidebar Navigation */}
      <nav
        className={`fixed lg:relative top-0 left-0 h-screen lg:h-auto z-40 w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[23vw] bg-white py-10 px-2 border-r border-gray-200 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          navbarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Location Filter */}
        <div className="flex relative flex-col px-4 py-2 border-b border-gray-100">
          <h2 className="text-sm  font-bold mb-2 uppercase text-gray-800">
            Location
          </h2>
          {(status === "success" || status === "denied") && (
            <button
              onClick={clearLocation}
              className="text-[13px] absolute right-5 pb-2 w-fit  cursor-pointer font-medium text-[#1E4ED8] hover:underline flex items-center gap-1"
            >
              <span>Clear</span>
            </button>
          )}

          <button
            onClick={detect}
            disabled={status === "loading"}
            className={`cursor-pointer w-full py-2 px-3  rounded-lg text-[13px] font-medium transition-all duration-200 flex items-center justify-center gap-2
                        ${status === "idle" ? "bg-white text-gray-700 border border-gray-400 hover:bg-gray-100" : ""}
                        ${status === "loading" ? "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed" : ""}
                        ${status === "denied" ? "bg-red-50 text-red-600 border border-red-200" : ""}
                        ${status === "success" ? "bg-green-50 text-green-600 border border-green-200" : ""}
                      `}
          >
            <FiMapPin size={16} />
            {status === "idle" && "Find Services Near Me"}
            {status === "loading" && "Detecting..."}
            {status === "denied" && "Location Denied"}
            {status === "success" && "Nearby Services"}
          </button>
        </div>

        {/* Price Filter */}
        <div className="flex flex-col px-4 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold mb-2 uppercase text-gray-800">
            Price
          </h2>
          <h2 className="text-[13px] font-medium py-1.5">
            ₹{minPrice}-₹{selectedPrice ? selectedPrice : maxPrice}
          </h2>
          <input
            type="range"
            className="cursor-pointer appearance-none range py-1"
            max={maxPrice}
            min={minPrice}
            value={selectedPrice || maxPrice}
            onChange={(e) => {
              const params = new URLSearchParams(search);
              params.set("price", e.target.value);
              navigate(`/services?${params.toString()}`);
            }}
          />
        </div>
        <div className="flex flex-col px-4 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold mb-2 uppercase text-gray-800">
            Availability
          </h2>
          <ul className="space-y-2">
            {/* Instant Booking Filter */}
            <div
              onClick={() => {
                const params = new URLSearchParams(search);

                if (instantBookingEnabled) {
                  params.delete("instantBooking");
                } else {
                  params.set("instantBooking", "true");
                }

                navigate(`/services?${params.toString()}`);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={instantBookingEnabled}
                readOnly
                id="instant"
                className="cursor-pointer"
              />
              <label
                htmlFor="instant"
                className="text-[13px] cursor-pointer font-medium text-gray-700 hover:text-[#1E4ED8] "
              >
                <span>Instant Booking</span>
              </label>
            </div>

            {/* Available Today Filter */}

            <div
              onClick={() => {
                const params = new URLSearchParams(search);

                if (availableTodayEnabled) {
                  params.delete("availableToday");
                } else {
                  params.set("availableToday", "true");
                }

                navigate(`/services?${params.toString()}`);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                id="available"
                className="cursor-pointer"
                checked={availableTodayEnabled}
                readOnly
              />
              <label
                htmlFor="available"
                className="text-[13px] cursor-pointer font-medium text-gray-700 hover:text-[#1E4ED8] "
              >
                <span>Available Today</span>
              </label>
            </div>
          </ul>
        </div>
        <div className="flex flex-col px-4 py-4">
          {/* Ratings Filter */}
          <h2 className="text-sm font-bold mb-2 uppercase text-gray-800">
            Ratings
          </h2>
          <ul className="space-y-2">
            <div
              onClick={() => {
                const parse = new URLSearchParams(search);
                if (selectedRating === "4.5") {
                  parse.delete("rating");
                } else {
                  parse.set("rating", "4.5");
                }
                navigate(`/services?${parse.toString()}`);
              }}
              className="flex items-center gap-2 "
            >
              <input
                type="checkbox"
                id="4.5&above"
                className="cursor-pointer"
                checked={selectedRating === "4.5"}
                readOnly
              />
              <label
                htmlFor="4.5&above"
                className="text-[13px]  cursor-pointer font-medium text-gray-700 hover:text-[#1E4ED8] flex items-center gap-1"
              >
                4.5{" "}
                <span>
                  <MdOutlineStarPurple500 />
                </span>{" "}
                & above
              </label>
            </div>
            <div
              onClick={() => {
                const parse = new URLSearchParams(search);
                if (selectedRating === "4") {
                  parse.delete("rating");
                } else {
                  parse.set("rating", "4");
                }
                navigate(`/services?${parse.toString()}`);
              }}
              className="flex items-center gap-2 "
            >
              <input
                type="checkbox"
                id="4&above"
                className="cursor-pointer"
                checked={selectedRating === "4"}
                readOnly
              />
              <label
                htmlFor="4&above"
                className="text-[13px]  cursor-pointer font-medium text-gray-700 hover:text-[#1E4ED8] flex items-center gap-1"
              >
                4{" "}
                <span>
                  <MdOutlineStarPurple500 />
                </span>{" "}
                & above
              </label>
            </div>
          </ul>
        </div>

        {/* Category Filter */}

        <div
          className="flex items-center justify-between px-4 py-3 border-t border-gray-100 cursor-pointer"
          onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
        >
          <h2 className="text-sm font-bold uppercase text-gray-800">
            Categories
          </h2>
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const params = new URLSearchParams(search);
                  params.delete("category");
                  params.delete("service");
                  navigate(`/services?${params.toString()}`);
                }}
                className="text-[13px] cursor-pointer font-medium text-[#1E4ED8] hover:underline flex items-center gap-1"
              >
                <span>Clear</span>
              </button>
            )}
            {isCategoryExpanded ? (
              <IoChevronUp className="text-gray-500" />
            ) : (
              <IoChevronDown className="text-gray-500" />
            )}
          </div>
        </div>
        {isCategoryExpanded && (
          <div className="flex flex-wrap gap-2 mx-4 mb-4">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => {
                    const params = new URLSearchParams(search);
                    params.set("category", category);
                    params.delete("service");
                    navigate(`/services?${params.toString()}`);
                  }}
                  className={`
                              px-2 py-1 rounded-lg border text-[13px] transition-all duration-200 w-fit
                              ${
                                isSelected
                                  ? "border-2 border-[#1E4ED8] text-[#1E4ED8] font-semibold"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-[#1E4ED8] hover:text-[#1E4ED8]"
                              }
                            `}
                >
                  {category}
                </button>
              );
            })}
          </div>
        )}

        {/* Service Filter */}

        <div
          className="flex items-center justify-between px-4 py-3 border-t border-gray-100 cursor-pointer"
          onClick={() => setIsServiceExpanded(!isServiceExpanded)}
        >
          <h2 className="text-sm font-bold uppercase text-gray-800">
            Services
          </h2>
          <div className="flex items-center gap-2">
            {selectedServices.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const params = new URLSearchParams(search);
                  params.delete("service");
                  navigate(`/services?${params.toString()}`);
                }}
                className="text-[13px] cursor-pointer font-medium text-[#1E4ED8] hover:underline flex items-center gap-1"
              >
                <span>Clear</span>
              </button>
            )}
            {isServiceExpanded ? (
              <IoChevronUp className="text-gray-500" />
            ) : (
              <IoChevronDown className="text-gray-500" />
            )}
          </div>
        </div>
        {isServiceExpanded && (
          <ul className="text-gray-700 mb-4 max-h-75 overflow-y-auto">
            {servicesInCategory.map((service) => {
              const isSelected = selectedServices.includes(service.name);

              const updatedSelectedServices = isSelected
                ? selectedServices.filter((s) => s !== service.name)
                : [...selectedServices, service.name];

              return (
                <div
                  key={service.id}
                  onClick={() => {
                    const params = new URLSearchParams(search);
                    params.delete("service");
                    if (selectedCategory) {
                      params.set("category", selectedCategory);
                    }
                    updatedSelectedServices.forEach((s) =>
                      params.append("service", s),
                    );
                    navigate(`/services?${params.toString()}`);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] transition-all duration-200 cursor-pointer`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className=" text-[13px] cursor-pointer border-gray-300"
                  />
                  <label
                    htmlFor={`service-${service.id}`}
                    className="cursor-pointer leading-tight text-[13px] hover:text-[#1E4ED8]"
                  >
                    {" "}
                    {service.name}{" "}
                  </label>
                </div>
              );
            })}
          </ul>
        )}

        {/* Clear All Filters */}

        <div className="px-4 mt-6 mb-2">
          <button
            className="w-full py-2.5 bg-white border border-gray-100 text-gray-700 text-[13px] font-medium rounded-lg hover:bg-red-50 hover:text-red-900 hover:border-red-100 transition-all flex items-center justify-center gap-2 duration-200 "
            onClick={() => {
              clearLocation();
              navigate("/services");
            }}
          >
            <RiResetRightLine />
            Reset Filters
          </button>
        </div>
      </nav>
    </>
  );
}

export default Filters;
