import { useCallback } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getServices } from "../../api/services";
import Loader, { ErrorState } from "../ui/Loader";
import ServiceCard from "../ui/ServiceCard";
import { useFetch } from "../../hooks/useFetch";
import { normalizeService } from "../../utils/normalize";

// number of services shown on the landing page
const TOP_SERVICES = 4;

function ServiceSection() {
  // the best rated services stand in for "top booked" until booking volume is
  // exposed per service
  const fetchServices = useCallback(
    () =>
      getServices().then((res) =>
        res.data.services
          .map(normalizeService)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, TOP_SERVICES),
      ),
    [],
  );

  const { data: services, loading, error, refetch } = useFetch(fetchServices, {
    initialData: [],
  });

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black">
            Top Booked Services
          </h1>
          <p className="text-sm text-gray-600">
            Discover the most popular services booked by customers near you
          </p>
        </div>
      </div>

      {loading && <Loader label="Loading services..." className="mb-10" />}

      {!loading && error && (
        <ErrorState message={error} onRetry={refetch} className="mb-10" />
      )}

      {!loading && !error && services.length === 0 && (
        <div className="mb-10 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <p className="font-semibold text-gray-900">No services yet</p>
          <p className="max-w-xs text-sm text-gray-500">
            Services will appear here as soon as providers start publishing them.
          </p>
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {services.map((service) => (
            <div key={service.id} className="w-full">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center">
        <Link
          to="/services"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex items-center gap-2 border border-[#1E4ED8] px-7 py-2 rounded-xl transition-all duration-300 hover:bg-[#1E4ED8] hover:shadow-md active:scale-95"
        >
          <span className="text-[#1E4ED8] font-medium transition-colors duration-400 group-hover:text-white">
            View More Services
          </span>

          <FiArrowRight className="text-[#1E4ED8] transition-all duration-300 group-hover:text-white group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default ServiceSection;
