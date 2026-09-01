import { FiShield, FiSmartphone, FiCreditCard, FiAward } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PageHero from "../../components/ui/PageHero";
import PrimaryBtn from "../../components/ui/PrimaryBtn";

const values = [
  {
    icon: <FiShield size={26} />,
    title: "Trust",
    description: "Every provider is verified before they can accept bookings",
  },
  {
    icon: <FiSmartphone size={26} />,
    title: "Simplicity",
    description: "Booking a service should take minutes, not hours",
  },
  {
    icon: <FiCreditCard size={26} />,
    title: "Fair Pricing",
    description: "No hidden charges, transparent pricing upfront",
  },
  {
    icon: <FiAward size={26} />,
    title: "Reliability",
    description: "Consistent quality service you can count on",
  },
];

function About() {
  const navigate = useNavigate();

  return (
    <div className="bg-linear-to-b from-white to-blue-50 flex flex-col gap-6">
      <PageHero
        img="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="About Fixly"
        subtitle="About"
      />

      {/* Our Story */}
      <div className="px-4 sm:px-6 md:px-10 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#163BA3] mb-4">
              Our Story
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 mb-4">
              Let's be honest — finding someone you can trust for everyday home
              tasks is harder than it should be. Whether it's a clogged sink, a
              broken appliance, or a home that just needs a good clean, you
              never really know who's going to show up at your door.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              That's exactly why Fixly exists. We wanted to make it simple for
              people to find reliable, verified local professionals for the
              things they need done around the house — no guesswork, no risks.
              Just connect with someone you can trust and get the job done
              right.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border border-blue-100/70">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="A professional helping with a home service"
              loading="lazy"
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* What We Do */}
      <div className="px-4 sm:px-6 md:px-10 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#163BA3] mb-4">
            What We Do
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-slate-600">
            Fixly connects customers with verified service providers across a
            wide range of categories — cleaning, repairing, installation, tech
            help, and much more. Our goal is simple: make booking a home service
            as easy as a few taps. You tell us what you need, pick a trusted
            professional near you, and we handle the rest so you never have to
            worry about it.
          </p>
        </div>
      </div>

      {/* Our Values */}
      <div className="px-4 sm:px-6 md:px-10 py-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#163BA3]">
            Our Values
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            The things that guide everything we do at Fixly
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative w-full rounded-2xl border border-blue-100/70 bg-white/90 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 text-center"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#1E4ED8] to-blue-400" />

              <div className="flex items-center justify-center mb-5 mt-3">
                <div className="bg-linear-to-br from-blue-50 to-blue-100 p-5 rounded-2xl shadow-sm group-hover:scale-105 group-hover:bg-blue-600 transition-all duration-300">
                  <div className="text-[#1E4ED8] transition-all duration-300">
                    {value.icon}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-[#163BA3] mb-2 tracking-tight">
                {value.title}
              </h3>

              <p className="text-sm leading-relaxed text-slate-500">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-4 sm:px-6 md:px-10 py-10">
        <div className="max-w-7xl mx-auto bg-[#0F2F66] rounded-2xl overflow-hidden text-center px-6 sm:px-10 py-12 sm:py-16 relative border border-gray-100 shadow-xl">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#1E4ED8] to-blue-400" />

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-50 mb-2">
            Want to be a part of Fixly?
          </h2>
          <p className="text-base text-gray-300 mb-8 max-w-xl mx-auto">
            Whether you need a service or want to offer one, there's a place for
            you here.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <PrimaryBtn
              onclick={() => {
                navigate("/services");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              btn="Browse Services"
              className="py-3 px-8 bg-[#1E4ED8]"
            />
            <button
              onClick={() => {
                navigate("/provider");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-white border border-white px-8 py-3 rounded-xl bg-white/10 text-sm font-semibold hover:bg-white/20 active:bg-white/30 duration-200 cursor-pointer"
            >
              Become a Provider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
