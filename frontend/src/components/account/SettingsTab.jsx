import { useState } from "react";

export function SettingsTab() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  const togglePref = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const preferenceItems = [
    {
      key: "emailNotifications",
      title: "Email Notifications",
      description: "Receive booking updates and offers via email",
    },
    {
      key: "smsNotifications",
      title: "SMS Notifications",
      description: "Get text message alerts for your appointments",
    },
    {
      key: "pushNotifications",
      title: "Push Notifications",
      description: "Get real-time updates in your browser",
    },
  ];

  return (
    <div className="max-w-xl">
      <div className="flex flex-col gap-4">
        {preferenceItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {item.title}
              </p>
              <p className="mt-0.5 text-[13px] text-gray-500">
                {item.description}
              </p>
            </div>

            <button
              onClick={() => togglePref(item.key)}
              aria-label={item.title}
              className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                prefs[item.key] ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  prefs[item.key] ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
        <h3 className="text-sm font-semibold text-red-600">Delete Account</h3>
        <p className="mt-1 text-[13px] text-red-500">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="mt-4 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete your account?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to permanently delete your account?
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Your bookings, saved addresses and account data will be removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                }}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
