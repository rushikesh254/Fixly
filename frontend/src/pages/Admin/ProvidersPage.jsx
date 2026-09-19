import { useCallback, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { toast } from "sonner";
import {
  getAdminProviders,
  updateProviderStatus,
} from "../../api/admin";
import ProviderDetailModal from "../../components/admin/ProviderDetailModal";
import Loader, { ErrorState } from "../../components/ui/Loader";
import SecondaryBtn from "../../components/ui/SecondaryBtn";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import defaultAvatar from "../../assets/avatardefault.png";
import { useFetch } from "../../hooks/useFetch";
import { getApiErrorMessage } from "../../utils/apiError";
import formatDate from "../../utils/formatDate";
import { normalizeProvider } from "../../utils/normalize";

function ProvidersPage() {
  const tabs = ["pending", "approved", "rejected", "blocked"];

  const fetchProviders = useCallback(
    () =>
      getAdminProviders().then((res) =>
        res.data.providers.map(normalizeProvider),
      ),
    [],
  );

  const {
    data: providers,
    loading,
    error,
    refetch,
  } = useFetch(fetchProviders, { initialData: [] });

  const [activeTab, setActiveTab] = useState("pending");
  const [selected, setSelected] = useState(null);
  const [blockTarget, setBlockTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // counts for each tab
  const tabCounts = {
    pending: providers.filter((p) => p.status === "pending").length,
    approved: providers.filter((p) => p.status === "approved").length,
    rejected: providers.filter((p) => p.status === "rejected").length,
    blocked: providers.filter((p) => p.status === "blocked").length,
  };

  // providers for the current tab
  const listFor = (status) => {
    const list = providers.filter((p) => p.status === status);
    if (status === "pending") {
      return [...list].sort(
        (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt),
      );
    }
    if (status === "approved") {
      return [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  };

  const currentList = listFor(activeTab);

  // filtered providers based on search query
  const filteredList = currentList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.providerName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // set provider status
  const setStatus = async (id, status) => {
    try {
      await updateProviderStatus(id, status);
      setSelected(null);
      toast.success(`Provider ${status} successfully.`);
      refetch();
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Could not update this provider."),
      );
    }
  };

  const handleApprove = () => setStatus(selected.id, "approved");
  const handleReject = () => setStatus(selected.id, "rejected");
  const handleUnblock = () => setStatus(selected.id, "approved");

  const confirmBlock = async () => {
    if (!blockTarget) return;
    await setStatus(blockTarget.id, "blocked");
    setBlockTarget(null);
  };

  const Avatar = ({ provider }) => (
    <img
      src={provider.image || defaultAvatar}
      alt={provider.name}
      className="h-10 w-10 rounded-full object-cover"
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:px-15">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            All Providers
            <span className="rounded-full bg-blue-100 px-3 py-1 text-[12px] font-semibold text-blue-600">
              {providers.length}
            </span>
          </h1>
          <p className="text-gray-500 text-[13px] sm:text-sm mt-0.5">
            Review, approve and manage service providers.
          </p>
        </div>
        <div className="relative w-full sm:w-64 shrink-0">
          <FiSearch
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search name or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-[12px] text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-50 transition-all duration-200 bg-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mt-6 items-center gap-0 sm:gap-5 border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 flex items-center gap-2 sm:px-4 py-2 text-[11px] sm:text-[13px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer border-b-2 ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <span className="capitalize">{tab}</span>
            {tabCounts[tab] > 0 && (
              <span
                className={`text-[10px] flex items-center justify-center w-5 h-5 rounded-full font-semibold ${
                  activeTab === tab
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {tabCounts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && <Loader label="Loading providers..." className="mt-8" />}

      {!loading && error && (
        <ErrorState message={error} onRetry={refetch} className="mt-8" />
      )}

      {!loading && !error && filteredList.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No providers found"
            description="No providers match your current search or status filter."
          />
        </div>
      ) : (
        !loading &&
        !error && (
        <>
          {/* Table */}
          <div className="hidden md:block mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-semibold whitespace-nowrap text-left">
                    Provider ID
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap text-left">
                    Provider
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap text-left">
                    Category
                  </th>
                  {activeTab === "pending" && (
                    <th className="px-4 py-3 font-semibold whitespace-nowrap text-left">
                      Applied On
                    </th>
                  )}
                  {(activeTab === "approved" || activeTab === "blocked") && (
                    <th className="px-4 py-3 font-semibold whitespace-nowrap text-left">
                      Rating
                    </th>
                  )}
                  {activeTab === "approved" && (
                    <th className="px-4 py-3 font-semibold whitespace-nowrap text-left">
                      Bookings
                    </th>
                  )}
                  <th className="px-4 py-3 font-semibold whitespace-nowrap text-left">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 last:border-0 transition hover:bg-blue-50/40"
                  >
                    <td className="px-4 py-3.5 text-[13px] font-medium text-gray-500 whitespace-nowrap">
                      {p.id}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar provider={p} />
                        <div className="flex flex-col">
                          <p className="text-[13px] font-semibold text-gray-900 whitespace-nowrap">
                            {p.name}
                          </p>
                          <p className="text-[12px] text-gray-500 whitespace-nowrap">
                            {p.providerName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-600 whitespace-nowrap">
                      {p.category}
                    </td>
                    {activeTab === "pending" && (
                      <td className="px-4 py-3.5 text-[13px] text-gray-500 whitespace-nowrap">
                        {formatDate(p.appliedAt)}
                      </td>
                    )}
                    {(activeTab === "approved" || activeTab === "blocked") && (
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="flex items-center gap-1 text-[13px] font-medium text-gray-900">
                          <FaStar size={12} className="text-amber-400" />
                          {p.rating || "-"}
                        </span>
                      </td>
                    )}
                    {activeTab === "approved" && (
                      <td className="px-4 py-3.5 text-[13px] text-gray-500 whitespace-nowrap">
                        {p.bookingsCompleted}
                      </td>
                    )}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <SecondaryBtn
                        btn="View"
                        onclick={() => setSelected(p)}
                        className="text-blue-600! border-blue-100! bg-blue-50! hover:bg-blue-600! hover:text-white!"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 flex flex-col gap-4 md:hidden">
            {filteredList.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar provider={p} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">
                        {p.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {p.providerName}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      p.status === "pending"
                        ? "bg-amber-100 text-amber-600"
                        : p.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                    }`}
                  >
                    <span className="capitalize">{p.status}</span>
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">
                    {p.category}
                  </span>
                  {activeTab === "pending" && (
                    <span>Applied {formatDate(p.appliedAt)}</span>
                  )}
                  {activeTab === "approved" && (
                    <>
                      <span className="flex items-center gap-1 font-medium text-gray-900">
                        <FaStar size={12} className="text-amber-400" />
                        {p.rating || "-"}
                      </span>
                      <span>{p.bookingsCompleted} bookings</span>
                    </>
                  )}
                  {activeTab === "blocked" && (
                    <span className="flex items-center gap-1 font-medium text-gray-900">
                      <FaStar size={12} className="text-amber-400" />
                      {p.rating || "-"}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <SecondaryBtn
                    btn="View Details"
                    onclick={() => setSelected(p)}
                    className="w-full text-blue-600! border-blue-100! bg-blue-50! hover:bg-blue-600! hover:text-white!"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
        )
      )}

      {/* Detail Modal */}
      {selected && (
        <ProviderDetailModal
          provider={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onBlock={() => {
            setBlockTarget(selected);
            setSelected(null);
          }}
          onUnblock={handleUnblock}
        />
      )}

      {/* Block confirmation */}
      {blockTarget && (
        <ConfirmDialog
          title={`Block ${blockTarget.providerName}?`}
          message={
            <p>
              {blockTarget.name} will be removed from the approved providers
              list.
            </p>
          }
          cancelLabel="Cancel"
          confirmLabel="Block"
          onCancel={() => setBlockTarget(null)}
          onConfirm={confirmBlock}
        />
      )}
    </div>
  );
}

export default ProvidersPage;
