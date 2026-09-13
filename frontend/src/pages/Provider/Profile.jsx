import { useState } from "react";
import {
  CiFileOn,
  CiMedicalClipboard,
  CiStar,
  CiUser,
} from "react-icons/ci";
import ProviderInfo from "../../components/provider/ProviderInfo.jsx";
import MyServices from "../../components/provider/MyServices.jsx";
import Documents from "../../components/provider/Documents.jsx";
import ReviewsRatings from "../../components/provider/ReviewsRatings.jsx";
import providers from "../../data/providers.js";
import Sidebar from "../../components/ui/Sidebar.jsx";

const provider = providers.find((p) => p.id === "PRV-0001");

const sidebarItems = [
  {
    id: "info",
    label: "Provider Info",
    icon: <CiUser size={20} />,
  },
  {
    id: "services",
    label: "My Services",
    icon: <CiMedicalClipboard size={20} />,
  },
  { id: "documents", label: "Documents", icon: <CiFileOn size={20} /> },
  { id: "reviews", label: "Ratings & Reviews", icon: <CiStar size={20} /> },
];

const tabMeta = {
  info: {
    title: "Provider Information",
    description: "Manage your business details",
  },
  services: {
    title: "My Services",
    description: "Add and manage the services you offer",
  },
  documents: {
    title: "Documents",
    description: "Upload and manage your verification documents",
  },
  reviews: {
    title: "Ratings & Reviews",
    description: "See what customers are saying about you",
  },
};

function Profile() {
  const [activeTab, setActiveTab] = useState("info");

  const navItems = sidebarItems.map((item) => ({
    ...item,
    active: activeTab === item.id,
    onClick: () => setActiveTab(item.id),
  }));

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        section="PROFILE"
        navItems={navItems}
        user={provider}
        goBack="/provider/dashboard"
      />

      {/* Main */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {tabMeta[activeTab].title}
                </h1>

                <p className="mt-1 text-[13px] text-gray-500">
                  {tabMeta[activeTab].description}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-8 sm:mt-10">
            {activeTab === "info" && <ProviderInfo provider={provider} />}
            {activeTab === "services" && <MyServices provider={provider} />}
            {activeTab === "documents" && <Documents />}
            {activeTab === "reviews" && <ReviewsRatings provider={provider} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;