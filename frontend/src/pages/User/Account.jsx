import { useState } from "react";
import { CiLocationOn, CiLock, CiSettings, CiUser } from "react-icons/ci";
import { MdOutlineContactSupport } from "react-icons/md";
import { AddressTab } from "../../components/account/AddressTab.jsx";
import { PasswordTab } from "../../components/account/PasswordTab.jsx";
import { PersonalTab } from "../../components/account/PersonalTab.jsx";
import { SettingsTab } from "../../components/account/SettingsTab.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import ContactPage from "../Public/ContactPage.jsx";
import Sidebar from "../../components/ui/Sidebar.jsx";

const sidebarItems = [
  { id: "personal", label: "Personal Information", icon: <CiUser size={20} /> },
  {
    id: "address",
    label: "Manage Address",
    icon: <CiLocationOn size={20} />,
  },
  { id: "password", label: "Change Password", icon: <CiLock size={20} /> },
  { id: "settings", label: "Account Settings", icon: <CiSettings size={20} /> },
  {
    id: "support",
    label: "Support",
    icon: <MdOutlineContactSupport size={20} />,
  },
];

const tabMeta = {
  personal: {
    title: "Personal Information",
    description: "Manage your account details",
  },
  address: {
    title: "Manage Address",
    description: "Add or change the address your services are delivered to",
  },
  password: {
    title: "Change Password",
    description: "Update your account password",
  },
  settings: {
    title: "Account Settings",
    description: "Manage your account",
  },
  support: {
    title: "Support",
    description: "Contact our support team for assistance",
  },
};

function Account() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");

  const navItems = sidebarItems.map((item) => ({
    ...item,
    active: activeTab === item.id,
    onClick: () => setActiveTab(item.id),
  }));

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        section="ACCOUNT"
        navItems={navItems}
        user={user}
        // /account is reachable by every role, so go back to the right dashboard
        goBack={`/${user?.role || "user"}/dashboard`}
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
            {activeTab === "personal" && (
              <PersonalTab user={user} />
            )}
            {activeTab === "address" && <AddressTab />}
            {activeTab === "password" && <PasswordTab />}
            {activeTab === "settings" && <SettingsTab />}
            {activeTab === "support" && <ContactPage hideHero />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Account;