import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import ServiceCard from "../ui/ServiceCard";

function ServiceSection() {
  const services = [
    {
      providerName: "CleanPro Services",
      service: "Home Cleaning",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
      rating: "4.8",
      location: "Delhi",
      price: "499",
      tag: "Popular",
    },
    {
      providerName: "AC Repair Experts",
      service: "AC Repair",
      image:
        "https://plus.unsplash.com/premium_photo-1682126012378-859ca7a9f4cf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: "4.7",
      location: "Mumbai",
      price: "699",
      tag: "Trending",
    },
    {
      providerName: "Plumbing Masters",
      service: "Plumbing",
      image:
        "https://plus.unsplash.com/premium_photo-1664299069577-11579b487e6c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: "4.6",
      location: "Bangalore",
      price: "399",
      tag: "Top Rated",
    },
    {
      providerName: "Electrician Pro",
      service: "Electrician",
      image:
        "https://plus.unsplash.com/premium_photo-1661911309991-cc81afcce97d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: "4.9",
      location: "Pune",
      price: "299",
      tag: "Popular",
    },
  ];

  return (
    <div className="px-4 md:px-10 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black">
            Top Booked Services
          </h1>
          <p className="text-sm text-gray-600">
            Discover the most popular services booked by customers near you
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 place-items-center">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>

      <div className="flex items-center justify-center">
        <Link
          to="/services"
          className="group flex items-center gap-2 border border-[#1E4ED8] px-7 py-2 rounded-xl transition-all duration-300 hover:bg-[#1E4ED8] hover:shadow-md active:scale-95"
        >
          <span className="text-[#1E4ED8] font-medium transition-colors duration-300 group-hover:text-white">
            View More Services
          </span>

          <FaArrowRight className="text-[#1E4ED8] transition-all duration-300 group-hover:text-white group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default ServiceSection;
