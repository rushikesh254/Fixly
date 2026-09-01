import {
  FiClock,
  FiSearch,
  FiShield,
  FiFileText,
  FiMapPin,
  FiBriefcase,
  FiPhone,
  FiHome,
  FiTool,
  FiBox,
  FiMonitor,
  FiHeart,
  FiEdit,
  FiCoffee,
} from "react-icons/fi";
import { IoIosTrendingUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import PageHero from "../../components/ui/PageHero";
import PrimaryBtn from "../../components/ui/PrimaryBtn";

const benefits = [
  {
    icon: <FiClock size={26} />,
    title: "Flexible Hours",
    description: "Work when you want, accept jobs that fit your schedule",
  },
  {
    icon: <IoIosTrendingUp size={26} />,
    title: "Earn More",
    description: "Get paid directly by customers, no hidden cuts",
  },
  {
    icon: <FiSearch size={26} />,
    title: "Get Discovered",
    description: "Reach customers actively searching for your service nearby",
  },
  {
    icon: <FiShield size={26} />,
    title: "Easy Onboarding",
    description: "Get verified and start in just a few steps",
  },
];

const steps = [
  {
    step: 1,
    title: "Create Your Account",
    description: "Sign up as a provider in a few clicks",
  },
  {
    step: 2,
    title: "Add Your Service Info",
    description:
      "Select your service category, set your price, and describe what you offer",
  },
  {
    step: 3,
    title: "Get Verified",
    description:
      "Our team reviews your details and documents to ensure trust and quality",
  },
  {
    step: 4,
    title: "Start Earning",
    description:
      "Once verified, receive bookings and start working with customers near you",
  },
];

const categories = [
  { icon: <FiHome size={24} />, name: "Cleaning" },
  { icon: <FiTool size={24} />, name: "Repairing" },
  { icon: <FiBox size={24} />, name: "Installation" },
  { icon: <FiMonitor size={24} />, name: "Tech Services" },
  { icon: <FiHeart size={24} />, name: "Personal Services" },
  { icon: <FiEdit size={24} />, name: "Home Improvement" },
  { icon: <FiCoffee size={24} />, name: "Food Services" },
];

const requirements = [
  {
    icon: <FiFileText size={22} />,
    text: "Valid government ID proof",
  },
  {
    icon: <FiMapPin size={22} />,
    text: "Address proof",
  },
  {
    icon: <FiBriefcase size={22} />,
    text: "Basic experience in your chosen service",
  },
  {
    icon: <FiPhone size={22} />,
    text: "A working phone number for bookings",
  },
];

function ProviderPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-linear-to-b from-white to-blue-50 flex flex-col gap-6">
      <PageHero
        img="https://plus.unsplash.com/premium_photo-1661302884827-5d0474877b5f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="Be a Provider"
        subtitle="Providers"
        position="40%"
      />

      {/* Intro */}
      <div className="px-4 sm:px-6 md:px-10 pt-12 sm:pt-14 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-[#163BA3] mb-3 leading-snug tracking-tight">
          Your skills + <span className="text-[#1E4ED8]">Fixly</span>{" "}
          <span> → </span>{" "}
          <span className="text-[#1E4ED8] border-b-2 border-[#1E4ED8] pb-0.5">
            steady income
          </span>
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Turn what you're good at into a reliable stream of work. Join Fixly,
          and we'll handle the customers while you focus on the job.
        </p>
      </div>

      {/* Why Join Fixly */}
      <div className="px-4 sm:px-6 md:px-10 py-12">
        <div className="max-w-7xl mx-auto bg-[#0F2F66] rounded-2xl px-4 sm:px-8 py-10 sm:py-12 relative overflow-hidden shadow-xl">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#1E4ED8] to-blue-400" />

          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-50">
              Why Join Fixly
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              Everything you need to grow as a service provider
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative w-full rounded-2xl bg-white/95 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 text-center overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-[#2956de] to-blue-400" />

                <div className="flex items-center justify-center mb-4 mt-2">
                  <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-2xl shadow-sm group-hover:scale-105 group-hover:bg-blue-600 transition-all duration-300">
                    <div className="text-[#1E4ED8] transition-all duration-300">
                      {benefit.icon}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-[#163BA3] mb-2 tracking-tight">
                  {benefit.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-500">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-4 sm:px-6 md:px-10 py-10">
        <div className="text-left mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black">
            How It Works
          </h2>
          <p className="text-sm text-gray-600">
            A simple process to get you up and running
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-8 left-10 right-10 h-0.5 bg-blue-100" />

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center"
              >
                <div className="relative z-10 mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#1E4ED8] text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-200 ring-4 ring-blue-50">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[#163BA3] mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 max-w-55">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories You Can Offer */}
      <div className="px-4 sm:px-6 md:px-10 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#163BA3]">
            Categories You Can Offer
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Pick the services you are best at and start earning
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 sm:gap-5">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-blue-100 bg-white/80 py-5 px-4 shadow-sm hover:shadow-md hover:border-[#1E4ED8] hover:bg-[#1E4ED8] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E4ED8] flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:text-white">
                {category.icon}
              </div>
              <span className="text-sm font-semibold text-[#163BA3] text-center transition-colors duration-300 group-hover:text-white">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* What You'll Need */}
      <div className="px-4 sm:px-6 md:px-10 py-10">
        <div className="max-w-4xl mx-auto relative rounded-2xl border border-blue-100/70 bg-white/90 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#1E4ED8] to-blue-400" />

          <div className="p-6 sm:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
              What You'll Need
            </h2>
            <p className="text-sm text-gray-600 mb-8">
              Just a few basic things to get started with Fixly
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {requirements.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl border border-blue-50 bg-blue-50/50 group hover:bg-blue-50 transition-colors duration-200"
                >
                  <span className="w-11 h-11 shrink-0 rounded-full bg-blue-100 text-[#1E4ED8] flex items-center justify-center group-hover:bg-[#1E4ED8] group-hover:text-white transition-colors duration-200">
                    {item.icon}
                  </span>
                  <p className="text-sm sm:text-base text-slate-600 font-medium">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-4 sm:px-6 md:px-10 py-12">
        <div className="max-w-7xl mx-auto bg-[#0F2F66] rounded-2xl overflow-hidden text-center px-6 sm:px-10 py-12 sm:py-16 relative border border-gray-100 shadow-xl">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#1E4ED8] to-blue-400" />

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-50 mb-4">
            Ready to grow your business with Fixly?
          </h2>
          <p className="text-base text-gray-300 mb-8 max-w-xl mx-auto">
            Join a growing network of trusted providers and start earning from
            your skills today.
          </p>

          <PrimaryBtn
            onclick={() => navigate("/auth", { state: { isFlipped: true } })}
            btn="Register as Provider"
            className="py-3 px-8 bg-[#1E4ED8]"
          />

          <p className="text-xs sm:text-sm text-blue-200/80 mt-4">
            No sign-up fees. Free to start.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProviderPage;