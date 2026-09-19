import { FiArrowLeft } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import PrimaryBtn from "../ui/PrimaryBtn";
import SecondaryBtn from "../ui/SecondaryBtn";
import formatDate from "../../utils/formatDate";

function ProviderDetailModal({
  provider,
  onClose,
  onApprove,
  onReject,
  onBlock,
  onUnblock,
}) {
  // get string from object
  const address = provider.address
    ? Object.values(provider.address).filter(Boolean).join(", ")
    : provider.location || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
        <div
          className={`h-1 shrink-0 bg-gradient-to-r ${
            provider.status === "pending"
              ? "from-amber-400 to-orange-500"
              : provider.status === "approved"
                ? "from-emerald-400 to-teal-500"
                : provider.status === "blocked"
                  ? "from-red-400 to-rose-500"
                  : "from-slate-400 to-slate-500"
          }`}
        ></div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-900 truncate">
                {provider.name}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                {provider.providerName}
              </p>
            </div>
          </div>
          {provider.status === "pending" && (
            <span className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">
              Pending
            </span>
          )}
          {provider.status === "approved" && (
            <span className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
              Approved
            </span>
          )}
          {provider.status === "rejected" && (
            <span className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-50 text-gray-600">
              Rejected
            </span>
          )}
          {provider.status === "blocked" && (
            <span className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600">
              Blocked
            </span>
          )}
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Contact */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded-full inline-block bg-blue-600"></span>
              CONTACT DETAILS
            </h2>
            <div className="space-y-2.5 text-[12px]">
              <div className="flex justify-between gap-4 items-center">
                <span className="text-slate-500 shrink-0">Phone</span>
                <span className="font-medium text-slate-800">
                  {provider.phoneNumber}
                </span>
              </div>
              <div className="flex justify-between gap-4 items-center">
                <span className="text-slate-500 shrink-0">Email</span>
                <span className="font-medium text-slate-800">
                  {provider.email}
                </span>
              </div>
              <div className="flex justify-between gap-4 items-start">
                <span className="text-slate-500 shrink-0">Address</span>
                <span className="font-medium text-slate-800 text-right">
                  {address}
                </span>
              </div>
            </div>
          </div>

          {/* Profile */}
          {(provider.status === "pending" ||
            provider.status === "rejected") && (
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
                <span className="w-1 h-5 rounded-full inline-block bg-violet-500"></span>
                PROFILE
              </h2>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between gap-4 items-center">
                  <span className="text-slate-500 shrink-0">Experience</span>
                  <span className="font-medium text-slate-800">
                    {provider.experience}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Bio</span>
                  <p className="mt-1 text-[12px] text-slate-700 leading-relaxed">
                    {provider.bio}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Performance */}
          {(provider.status === "approved" ||
            provider.status === "blocked") && (
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
                <span className="w-1 h-5 rounded-full inline-block bg-emerald-500"></span>
                PERFORMANCE
              </h2>
              <div className="space-y-2.5 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Rating</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <FaStar size={12} className="text-amber-400" />
                    {provider.rating || "-"}
                    {provider.status === "approved" && (
                      <span className="font-normal text-slate-500">
                        ({provider.totalReviews} reviews)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between gap-4 items-center">
                  <span className="text-slate-500 shrink-0">
                    Bookings Completed
                  </span>
                  <span className="font-medium text-slate-800">
                    {provider.bookingsCompleted}
                  </span>
                </div>
                {provider.status === "blocked" && provider.blockedAt && (
                  <div className="flex justify-between gap-4 items-center">
                    <span className="text-slate-500 shrink-0">Blocked On</span>
                    <span className="font-medium text-slate-800">
                      {formatDate(provider.blockedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Services */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded-full inline-block bg-amber-500"></span>
              SERVICES OFFERED
            </h2>
            {provider.services?.length ? (
              <div className="space-y-2.5">
                {provider.services.map((s) => (
                  <div
                    key={s.serviceId}
                    className="rounded-xl border border-slate-200 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-semibold text-slate-800">
                        {s.title}
                      </p>
                      <p className="text-[13px] font-bold text-slate-900">
                        ₹{s.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {s.estimatedDuration}
                    </p>
                    {s.includes?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.includes.map((inc, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700"
                          >
                            {inc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-slate-500">No services listed.</p>
            )}
          </div>

        </div>

        {/* actions */}
        <div className="border-t border-slate-100 px-5 py-4 flex items-center justify-end gap-3 shrink-0">
          {provider.status === "pending" && (
            <>
              <SecondaryBtn
                btn="Reject"
                onclick={onReject}
                className="text-red-500! border-red-200! hover:bg-red-50! hover:border-red-300!"
              />
              <PrimaryBtn btn="Approve" onclick={onApprove} />
            </>
          )}
          {provider.status === "approved" && (
            <>
              <SecondaryBtn
                btn="Close"
                onclick={onClose}
                className="text-gray-600! border-gray-200! bg-gray-50! hover:bg-gray-100! hover:text-gray-800!"
              />
              <PrimaryBtn
                btn="Block"
                onclick={onBlock}
                className="bg-red-600! hover:bg-red-700!"
              />
            </>
          )}
          {provider.status === "blocked" && (
            <>
              <SecondaryBtn
                btn="Close"
                onclick={onClose}
                className="text-gray-600! border-gray-200! bg-gray-50! hover:bg-gray-100! hover:text-gray-800!"
              />
              <PrimaryBtn btn="Unblock" onclick={onUnblock} />
            </>
          )}
          {provider.status === "rejected" && (
            <SecondaryBtn
              btn="Close"
              onclick={onClose}
              className="text-gray-600! border-gray-200! bg-gray-50! hover:bg-gray-100! hover:text-gray-800!"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProviderDetailModal;
