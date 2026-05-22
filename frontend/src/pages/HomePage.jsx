import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import ProviderSection from "../components/home/ProviderSection";
import ServiceSection from "../components/ui/ServiceSection";
import TestimonialSection from "../components/home/TestimonialSection";

function HomePage() {
  return (
    <div className="bg-linear-to-b from-white to-blue-50 flex flex-col gap-10">
      <HeroSection />
      <ServiceSection />
      <HowItWorks />
      <ProviderSection />
      <TestimonialSection />
    </div>
  );
}

export default HomePage;
