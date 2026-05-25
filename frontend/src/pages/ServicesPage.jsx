import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi";
import { RiResetRightLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import Filters from "../components/service/Filters";
import ServiceCard from "../components/service/ServiceCard";
import PageHero from "../components/ui/PageHero";
import PrimaryBtn from "../components/ui/PrimaryBtn";
import services from "../constants/services";
import providers from "../data/providers";
import { useLocate } from "../hooks/useLocate";
import categories from "../constants/categories";

function ServicesPage() {
  const { status, detect, nearbyProvidersList, clearLocation } = useLocate();

  const { register, handleSubmit } = useForm();
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
  const [isServiceExpanded, setIsServiceExpanded] = useState(false);

  const { search } = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(search);
  const selectedCategory = queryParams.get("category");
  const selectedServices = queryParams.getAll("service");
  const selectedPrice = queryParams.get("price");
  const selectedRating = queryParams.get("rating");
  const instantBookingEnabled = queryParams.get("instantBooking") === "true"; //because it returns string and we want boolean
  const availableTodayEnabled = queryParams.get("availableToday") === "true";

  // Calculate min and max price for filters
  const maxPrice = providers.reduce(
    (acc, cv) => (acc > cv.price ? acc : cv.price),
    0,
  );
  const minPrice = providers.reduce((acc, cv) =>
    acc < cv.price ? acc : cv.price,
  );

  //services in selected category

  const servicesInCategory = selectedCategory
    ? services.filter((service) => service.category === selectedCategory)
    : services;

  //with  filters like category,service, price, rating, instant booking, available today

  const filteredProviders = providers.filter((provider) => {
    if (selectedCategory && provider.category !== selectedCategory) {
      return false;
    }

    if (
      selectedServices.length > 0 &&
      !selectedServices.includes(provider.title)
    ) {
      return false;
    }

    if (instantBookingEnabled && provider.instantBooking !== true) {
      return false;
    }
    if (availableTodayEnabled && provider.availableToday !== true) {
      return false;
    }
    if (selectedPrice && provider.price > parseInt(selectedPrice)) {
      return false;
    }
    if (selectedRating && provider.rating < parseFloat(selectedRating)) {
      return false;
    }
    return true;
  });

  //with location filters

  const displayedProviders =
    status === "success"
      ? filteredProviders
          .map((provider) => {
            const nearby = nearbyProvidersList.find(
              (p) => p.id === provider.id,
            );
            return nearby ? { ...provider, distance: nearby.distance } : null;
          })
          .filter(Boolean)
          .sort((a, b) => a.distance - b.distance)
      : filteredProviders;

  return (
    <div>
      {
        <PageHero
          img="https://plus.unsplash.com/premium_photo-1661963478928-2d2d3e9b1e25?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          title="Our Services"
          subtitle="Services"
          position="100%"
        />
      }
      <div className="min-h-screen flex">
        {/* sidebar */}
        <Filters
          status={status}
          detect={detect}
          clearLocation={clearLocation}
          minPrice={minPrice}
          selectedPrice={selectedPrice}
          maxPrice={maxPrice}
          search={search}
          navigate={navigate}
          instantBookingEnabled={instantBookingEnabled}
          availableTodayEnabled={availableTodayEnabled}
          selectedRating={selectedRating}
          isCategoryExpanded={isCategoryExpanded}
          setIsCategoryExpanded={setIsCategoryExpanded}
          isServiceExpanded={isServiceExpanded}
          setIsServiceExpanded={setIsServiceExpanded}
          selectedCategory={selectedCategory}
          categories={categories}
          servicesInCategory={servicesInCategory}
          selectedServices={selectedServices}
        />

        {/* main content */}
        <div className="flex-1  py-8 px-8  bg-gray-50  scrollbar-hide">
          {/* search and results header */}
          <div className="mb-8 ">
            <form onSubmit={handleSubmit((data) => console.log(data))}>
              <div className="max-w-lg mb-5 text-gray-700 py-3   relative">
                <input
                  {...register("service", {
                    required: "Please enter a service",
                  })}
                  type="text"
                  spellCheck="false"
                  className="w-full border border-gray-300 px-6 backdrop-blur-sm focus:outline-none focus:border-2 focus:border-blue-400 transition hover:border-gray-400 py-2 placeholder:text-sm text:gray-400 text-sm rounded-full"
                  placeholder="Search for services"
                />

                <PrimaryBtn
                  btn={<FiSearch size={18} />}
                  className="absolute right-0 top-2 translate-y-1 px-6 py-2.5 rounded-r-full! "
                />
              </div>
            </form>
            <h1 className="text-2xl font-semibold ">Results</h1>
            <p className=" text-sm text-gray-600">
              Check out our available services{" "}
            </p>
          </div>

          {/* if no provider found */}
          {displayedProviders.length === 0 && (
            <div className="flex flex-col bg-white rounded-2xl py-20 items-center justify-center gap-4 mt-10">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="No results"
                className="w-24 opacity-50"
              />
              <p className="text-gray-800 font-bold">No Providers found</p>
              <p className="text-gray-500 text-sm max-w-sm  text-center">
                No services match your filters. Try adjusting your filters or
                search criteria to discover more providers.
              </p>
              <div className="px-4 mt-6 mb-2">
                <button
                  className="w-full py-2.5 bg-white border border-gray-100 text-gray-700 text-[13px] font-medium rounded-lg hover:bg-red-50 hover:text-red-900 hover:border-red-100 transition-all flex items-center justify-center gap-2 duration-200 px-35"
                  onClick={() => {
                    clearLocation();
                    navigate("/services");
                  }}
                >
                  <RiResetRightLine />
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* providers grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-3 my-3 ">
            {displayedProviders
              .filter((provider) => provider.status === "approved")
              .map((provider) => (
                <ServiceCard key={provider.id} service={provider} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;
