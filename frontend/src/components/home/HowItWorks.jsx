import { FiCalendar, FiSearch, FiStar, FiUser } from "react-icons/fi";
import WorkingCard from "../ui/WorkingCard";

function HowItWorks() {
  const steps = [
    {
      icon: <FiSearch size={24} />,
      title: "Search Service",
      description: "Find the service you need near you quickly and easily.",
    },
    {
      icon: <FiCalendar size={24} />,
      title: "Schedule Appointment",
      description: "Select a convenient date and time.",
    },
    {
      icon: <FiUser size={24} />,
      title: "Get it Done",
      description: "Sit back while professionals complete your service.",
    },
    {
      icon: <FiStar size={24} />,
      title: "Review & Feedback",
      description: "Share your experience and help others decide.",
    },
  ];

  return (
    <div id="howItWorks" className="px-4 sm:px-6 md:px-10 py-5">
      <div className="text-left mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          How It Works
        </h2>
        <p className="text-sm text-gray-600">
          Simple steps to book your service
        </p>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 justify-items-center">
        {steps.map((step, index) => (
          <WorkingCard
            key={index}
            icon={step.icon}
            title={step.title}
            description={step.description}
            step={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;
