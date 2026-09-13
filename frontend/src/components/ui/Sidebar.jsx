import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { FiArrowLeft, FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/logo.png";

function Sidebar({
  navItems = [],
  section = "",
  subtitle = "",
  user = null,
  onLogout = null,
  goBack = null,
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-30 cursor-pointer rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden"
      >
        <FiMenu size={20} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-y-auto bg-white shadow-md transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="relative border-b border-slate-100 px-6 py-5">
          <Link to="/" onClick={close} className="flex flex-col">
            <img src={logo} alt="Fixly" className="w-28" />
            {subtitle && (
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[#1E4ED8]">
                {subtitle}
              </span>
            )}
          </Link>

          <button
            onClick={close}
            className="absolute top-4 right-3 cursor-pointer rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Section */}
        {section && (
          <p className="px-6 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {section}
          </p>
        )}

        {/* Nav items */}
        <nav className="space-y-1 px-3">
          {navItems.map((item) =>
            item.path ? (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={close}
                className={({ isActive }) =>
                  `flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-[13px] transition-colors ${
                    isActive
                      ? "bg-blue-100 font-semibold text-blue-600"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ) : (
              <button
                key={item.label}
                onClick={() => {
                  item.onClick?.();
                  close();
                }}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-[13px] transition-colors ${
                  item.active
                    ? "bg-blue-100 font-semibold text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ),
          )}
        </nav>

        {/* Footer user card + logout */}
        {user && (
          <div className="mt-auto border-t border-slate-100 p-4">
            {goBack && (
              <Link
                to={goBack}
                onClick={close}
                className="mb-3 flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <FiArrowLeft size={18} />
                <span>Go Back</span>
              </Link>
            )}
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Avatar"
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-[13px] capitalize font-semibold text-gray-800">
                  {user.name}
                </p>
                <p className="truncate text-[12px] capitalize text-gray-500">
                  {user.role}
                </p>
              </div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <CiLogout size={18} />
                <span>Logout</span>
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
