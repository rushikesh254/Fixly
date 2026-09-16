import { FiArrowLeft } from "react-icons/fi";
import defaultAvatar from "../../assets/avatardefault.png";
import formatDate from "../../utils/formatDate";
import PrimaryBtn from "../ui/PrimaryBtn";
import SecondaryBtn from "../ui/SecondaryBtn";

function UserDetailModal({ user, onClose, onBlock, onUnblock }) {
  // get string from object
  const address = user.address
    ? Object.values(user.address).filter(Boolean).join(", ")
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
        <div
          className={`h-1 shrink-0 bg-gradient-to-r ${
            user.status === "active"
              ? "from-emerald-400 to-teal-500"
              : "from-red-400 to-rose-500"
          }`}
        ></div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={onClose}
              className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            >
              <FiArrowLeft size={18} />
            </button>
            <img
              src={user.image || defaultAvatar}
              alt={user.name}
              className="h-12 w-12 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-900 truncate">
                {user.name}
              </h2>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          {user.status === "active" && (
            <span className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600">
              Active
            </span>
          )}
          {user.status === "blocked" && (
            <span className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600">
              Blocked
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Contact */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded-full inline-block bg-blue-600"></span>
              CONTACT DETAILS
            </h2>
            <div className="space-y-2.5 text-[12px]">
              {user.phone && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Phone</span>
                  <span className="font-medium text-slate-800 text-right">
                    {user.phone}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500 shrink-0">Email</span>
                <span className="font-medium text-slate-800 text-right">
                  {user.email}
                </span>
              </div>
              {address && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Address</span>
                  <span className="font-medium text-slate-800 text-right">
                    {address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Account */}
          <div className="px-5 py-4">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded-full inline-block bg-emerald-500"></span>
              ACCOUNT
            </h2>
            <div className="space-y-2.5 text-[12px]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500 shrink-0">Joined On</span>
                <span className="font-medium text-slate-800 text-right">
                  {formatDate(user.joinedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500 shrink-0">Total Bookings</span>
                <span className="font-medium text-slate-800 text-right">
                  {user.totalBookings}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-5 py-4 flex items-center justify-end gap-3 shrink-0">
          <SecondaryBtn
            btn="Close"
            onclick={onClose}
            className="text-gray-600! border-gray-200! bg-gray-50! hover:bg-gray-100! hover:text-gray-800!"
          />
          {user.status === "active" && (
            <PrimaryBtn
              btn="Block"
              onclick={onBlock}
              className="bg-red-600! hover:bg-red-700!"
            />
          )}
          {user.status === "blocked" && (
            <PrimaryBtn btn="Unblock" onclick={onUnblock} />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;
