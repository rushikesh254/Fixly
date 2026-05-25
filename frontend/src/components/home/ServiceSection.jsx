import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import services from "../../constants/services";
import providers from "../../data/providers";
import ServiceCard from "../service/ServiceCard";

function ServiceSection() {
  const topProviders = providers.slice(0, 4);
  const serviceNameById = Object.fromEntries(
    services.map((service) => [service.id, service.name]),
  );
  const providersWithServiceName = topProviders.map((provider) => ({
    ...provider,
    service: serviceNameById[provider.serviceId] ?? provider.serviceId,
  }));

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {providersWithServiceName.map((service, index) => (
          <div key={index} className="w-full">
            <ServiceCard service={service} />
          </div>
        ))}
      </div>

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
