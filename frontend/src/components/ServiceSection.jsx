import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import ServiceCard from "./ServiceCard";

function ServiceSection() {
  return (
    <div className=" px-10">
      <h1 className="text-2xl font-bold text-black mb-2 ">
        Top Booked Services
      </h1>
      <p className="text-sm text-gray-600 mb-10">
        Discover the most popular services booked by customers near you
      </p>
      <div className="flex gap-5 items-center mb-15">
        <ServiceCard />
        <ServiceCard />
        <ServiceCard />
        <ServiceCard />
      </div>
      <div className="flex items-center justify-center">
        <Link
          to="/services"
          className="group flex items-center gap-2 border border-blue-600 px-7 py-2 rounded-xl transition-all duration-300 hover:bg-blue-600"
        >
          <span className="text-blue-600 font-medium transition-colors duration-300 group-hover:text-white">
            View More Services
          </span>

          <FaArrowRight className="text-blue-600 transition-all duration-300 group-hover:text-white group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default ServiceSection;
