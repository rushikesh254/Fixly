import { useState } from "react";
import {
  CiFileOn,
  CiMedicalClipboard,
  CiStar,
  CiUser,
} from "react-icons/ci";
import { FiMenu, FiX } from "react-icons/fi";
import ProviderInfo from "../../components/provider/ProviderInfo.jsx";
import MyServices from "../../components/provider/MyServices.jsx";
import Documents from "../../components/provider/Documents.jsx";
import ReviewsRatings from "../../components/provider/ReviewsRatings.jsx";
import providers from "../../data/providers.js";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-20 bottom-0 left-0 z-20 w-64 overflow-y-auto bg-white shadow-md transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-sm ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative mb-6 flex flex-col items-center bg-linear-to-r from-blue-600 to-indigo-600 px-6 pt-7 pb-6">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 cursor-pointer rounded-full p-1.5 transition hover:bg-gray-300/10 lg:hidden"
          >
            <FiX
              size={24}
              className="text-gray-300 transition-transform duration-300 hover:scale-105"
            />
          </button>

          <img
            src={provider.image}
            alt="Provider Avatar"
            className="mb-3 h-14 w-14 rounded-full border-2 border-white/70 object-cover shadow-sm"
          />

          <h2 className="text-base font-semibold text-white">
            {provider.providerName}
          </h2>

          <p className="mb-3 text-[13px] text-gray-100">
            {provider.email}
          </p>
        </div>

        <ul className="pt-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-[13px] transition-colors duration-200 ${
                activeTab === item.id
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </ul>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-x-0 top-20 bottom-0 z-10 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
              >
                <FiMenu size={20} />
              </button>

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
