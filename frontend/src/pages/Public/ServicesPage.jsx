import { useCallback, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { RiResetRightLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { getCategories } from "../../api/categories";
import { getServices } from "../../api/services";
import { getServiceTypes } from "../../api/serviceTypes";
import Filters from "../../components/ui/Filters";
import Loader, { ErrorState } from "../../components/ui/Loader";
import ServiceCard from "../../components/ui/ServiceCard";
import PageHero from "../../components/ui/PageHero";
import PrimaryBtn from "../../components/ui/PrimaryBtn";
import { useFetch } from "../../hooks/useFetch";
import { useLocate } from "../../hooks/useLocate";
import { normalizeService } from "../../utils/normalize";

// radius used when the visitor asks for services near them
const NEARBY_DISTANCE_KM = 400;

function ServicesPage() {
  const { status, detect, userCoords, clearLocation, withDistance } = useLocate();

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

  // Get the search query from URL parameters
  const searchQuery = queryParams.get("q") || "";

  // State to track the search input value
  const [inputValue, setInputValue] = useState(searchQuery);

  // categories drive both the filter list and the category query parameter,
  // which stays a readable name so the footer links keep working
  const fetchCategories = useCallback(
    () => getCategories().then((res) => res.data.categories),
    [],
  );
  const { data: categoryList } = useFetch(fetchCategories, { initialData: [] });

  const categories = useMemo(
    () => (categoryList || []).map((category) => category.name),
    [categoryList],
  );

  const selectedCategoryId = useMemo(
    () =>
      (categoryList || []).find((category) => category.name === selectedCategory)
        ?._id || "",
    [categoryList, selectedCategory],
  );

  // the service filter lists the catalogue titles of the selected category
  const fetchServiceTypes = useCallback(
    () => getServiceTypes().then((res) => res.data.serviceTypes),
    [],
  );
  const { data: serviceTypes } = useFetch(fetchServiceTypes, {
    initialData: [],
  });

  const servicesInCategory = useMemo(
    () =>
      (serviceTypes || [])
        .filter(
          (type) => !selectedCategory || type.category?.name === selectedCategory,
        )
        .map((type) => ({ id: type._id, name: type.name })),
    [serviceTypes, selectedCategory],
  );

  // every filter the server can apply is sent as a query parameter, so the list
  // never has to be filtered down from a full copy of the catalogue
  const fetchServices = useCallback(() => {
    const params = {};
    if (searchQuery) params.keyword = searchQuery;
    if (selectedCategoryId) params.category = selectedCategoryId;
    if (selectedPrice) params.maxPrice = selectedPrice;
    if (selectedRating) params.minRating = selectedRating;
    if (instantBookingEnabled) params.instantBooking = true;
    if (availableTodayEnabled) params.availableToday = true;
    if (status === "success" && userCoords) {
      params.lat = userCoords.lat;
      params.lng = userCoords.lon;
      params.distance = NEARBY_DISTANCE_KM;
    }

    return getServices(params).then((res) =>
      res.data.services.map(normalizeService),
    );
  }, [
    searchQuery,
    selectedCategoryId,
    selectedPrice,
    selectedRating,
    instantBookingEnabled,
    availableTodayEnabled,
    status,
    userCoords,
  ]);

  const {
    data: services,
    loading,
    error,
    refetch,
  } = useFetch(fetchServices, { initialData: [] });

  // The slider bounds have to describe the whole catalogue, otherwise they would
  // shrink to the filtered result every time the price changes. Fetched once.
  const fetchPriceRange = useCallback(
    () =>
      getServices().then((res) => {
        const prices = res.data.services.map((service) => service.price);
        if (prices.length === 0) return { minPrice: 0, maxPrice: 5000 };
        return {
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
        };
      }),
    [],
  );
  const { data: priceRange } = useFetch(fetchPriceRange, {
    initialData: { minPrice: 0, maxPrice: 5000 },
  });

  const { minPrice, maxPrice } = priceRange || { minPrice: 0, maxPrice: 5000 };

  // the catalogue title filter is a multi select, which the api does not model
  const displayedServices = useMemo(() => {
    const filtered = (services || []).filter(
      (service) =>
        selectedServices.length === 0 || selectedServices.includes(service.title),
    );

    return withDistance(filtered);
  }, [services, selectedServices, withDistance]);

  const resetFilters = () => {
    clearLocation();
    navigate("/services");
  };

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
            >
              <div className="max-w-lg mb-5 text-gray-700 py-3   relative">
                <input
                  type="text"
                  spellCheck="false"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  className="w-full border border-gray-300 px-6 backdrop-blur-sm focus:outline-none focus:border-2 focus:border-blue-400 transition hover:border-gray-400 py-2 placeholder:text-[13px] text:gray-400 text-sm rounded-full"
                  placeholder="Search services, providers or location..."
                />

                <PrimaryBtn
                  type="submit"
                  btn={<FiSearch size={16} />}
                  className="absolute right-0 top-2 translate-y-1 px-2 sm:px-6 py-2.5 rounded-r-full! "
                />
              </div>
            </form>
            <h1 className="text-2xl font-semibold ">Results</h1>
            <p className=" text-sm text-gray-600">
              Check out our available services{" "}
            </p>
          </div>

          {loading && <Loader label="Loading services..." className="mt-10" />}

          {!loading && error && (
            <ErrorState message={error} onRetry={refetch} className="mt-10" />
          )}

          {/* if no service found */}
          {!loading && !error && displayedServices.length === 0 && (
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
                  onClick={resetFilters}
                >
                  <RiResetRightLine />
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* services grid */}
          {!loading && !error && displayedServices.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-3 my-3 ">
              {displayedServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;
