import { useCallback, useState } from "react";
import {
  CiMedicalClipboard,
  CiStar,
  CiUser,
} from "react-icons/ci";
import { getMyProviderProfile, getMyProviderReviews } from "../../api/providers";
import ProviderInfo from "../../components/provider/ProviderInfo.jsx";
import MyServices from "../../components/provider/MyServices.jsx";
import ReviewsRatings from "../../components/provider/ReviewsRatings.jsx";
import Loader, { ErrorState } from "../../components/ui/Loader.jsx";
import Sidebar from "../../components/ui/Sidebar.jsx";
import { useFetch } from "../../hooks/useFetch.js";
import { normalizeProvider, normalizeReview } from "../../utils/normalize.js";

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
  reviews: {
    title: "Ratings & Reviews",
    description: "See what customers are saying about you",
  },
};

function Profile() {
  const [activeTab, setActiveTab] = useState("info");

  const fetchProfile = useCallback(
    () =>
      Promise.all([getMyProviderProfile(), getMyProviderReviews()]).then(
        ([profileRes, reviewsRes]) => ({
          ...normalizeProvider(profileRes.data.provider),
          reviews: (reviewsRes.data.reviews || []).map(normalizeReview),
        }),
      ),
    [],
  );

  const { data: provider, loading, error, refetch } = useFetch(fetchProfile);

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
            {loading && <Loader label="Loading your profile..." />}

            {!loading && error && (
              <ErrorState message={error} onRetry={refetch} />
            )}

            {!loading && !error && provider && (
              <>
                {activeTab === "info" && (
                  <ProviderInfo provider={provider} onSaved={refetch} />
                )}
                {activeTab === "services" && <MyServices provider={provider} />}
                {activeTab === "reviews" && (
                  <ReviewsRatings provider={provider} />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
