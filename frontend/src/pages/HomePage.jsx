import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import ProviderSection from "../components/ProviderSection";
import ServiceSection from "../components/ServiceSection";

function HomePage() {
  return (
    <div className="bg-linear-to-b from-white to-blue-50 flex flex-col gap-10">
      <HeroSection />
      <ServiceSection />
      <HowItWorks />
      <ProviderSection />
    </div>
  );
}

export default HomePage;
