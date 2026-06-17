import { useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import logo from "../../assets/logo.png";
import PrimaryBtn from "./PrimaryBtn";

import { FiLogIn, FiMenu, FiX } from "react-icons/fi";
import { LuUserRoundPlus } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import { toast } from "sonner";

import { useAuth } from "../../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user, logout } = useAuth();

  const isStickyNav = location.pathname.startsWith("/user/");

  if (location.pathname === "/auth") {
    return null;
  }

  if (location.pathname === `/services/viewDetails/${id}`) {
    return null;
  }

  const navItems = user
    ? [
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Dashboard", path: "/user/dashboard" },
        { name: "Bookings", path: "/user/mybookings" },
        { name: "Saved", path: "/user/saved" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Providers", path: "/provider" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
      ];

  return (
    <>
      <div
        className={`top-0 left-0 z-30 w-full px-6 sm:px-10 lg:px-14 flex items-center justify-between transition-all duration-300 ${
          isStickyNav
            ? "sticky h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            : "absolute bg-transparent"
        }`}
      >
        <Link to="/" className="z-50">
          <img
            src={logo}
            alt="Logo"
            className={`w-28 transition-all duration-300 ${isStickyNav ? "sm:w-32" : "sm:w-36"}`}
          />
        </Link>
        {/* Navigation Links for Desktop */}
        <div className="hidden lg:block">
          <ul
            className={`flex items-center ${isStickyNav ? "gap-2" : "gap-8"}`}
          >
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `font-semibold transition duration-300 ${
                      isStickyNav
                        ? isActive
                          ? "inline-flex h-9 items-center rounded-md px-3 text-[15px] text-blue-600"
                          : "inline-flex h-9 items-center rounded-md px-3 text-[15px] text-slate-600  hover:text-blue-500"
                        : isActive
                          ? "text-blue-600"
                          : "text-white hover:text-blue-500"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        {/* Login and Sign Up Buttons for Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          {!user && (
            <button
              onClick={() => {
                navigate("/auth", { state: { isFlipped: false } });
              }}
              className="text-white cursor-pointer hover:scale-105 transition duration-300 flex items-center gap-2 font-semibold"
            >
              {<FiLogIn />}
              {"Login"}
            </button>
          )}
          {user && (
            <button
              onClick={() => {
                logout();
                toast.error("You have logged out.");
              }}
              className={`cursor-pointer hover:scale-105 transition duration-300 flex items-center gap-2 font-semibold ${
                isStickyNav
                  ? "h-9 rounded-md px-3 text-slate-600 hover:bg-red-50 hover:text-red-600"
                  : "text-white"
              }`}
            >
              {
                <CiLogout
                  className={`${isStickyNav ? "hover:text-red-600" : "text-white"}`}
                />
              }
              {"Logout"}
            </button>
          )}
          {!user && (
            <PrimaryBtn
              btn="Sign Up"
              onclick={() => {
                navigate("/auth", { state: { isFlipped: true } });
              }}
            />
          )}
        </div>
        {/*Sidebar Toggle Button for Mobile*/}
        <button
          className="lg:hidden z-50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <FiX
              size={30}
              className="text-gray-800 hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <FiMenu
              size={28}
              className={` hover:scale-105 transition-transform duration-300 ${isStickyNav ? "text-gray-600" : "text-white"}`}
            />
          )}
        </button>
      </div>

      <div
        className={`fixed top-0 right-0 h-screen w-72 bg-white z-40 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Sidebar Menu */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <img src={logo} alt="Logo" className="w-32" />

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 group rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <FiX
              size={24}
              className="text-gray-700  group-hover:scale-105 transition-transform duration-300"
            />
          </button>
        </div>
        {/* Login and Signup Buttons for Mobile */}
        <div className="border-b border-gray-100">
          {!user && (
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigate("/auth", { state: { isFlipped: false } });
              }}
              className="w-full  text-gray-700 text-[14px] hover:bg-gray-100 rounded-md px-8 py-3 transition"
            >
              <div className="flex items-center gap-2 cursor-pointer">
                {<FiLogIn />}
                {"Login"}
              </div>
            </button>
          )}
          {user && (
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                logout();
                toast.error("You have logged out.");
              }}
              className="w-full  text-gray-700 text-[14px] hover:bg-gray-100 rounded-md px-8 py-3 transition"
            >
              <div className="flex items-center gap-2 cursor-pointer">
                {<CiLogout />}
                {"Logout"}
              </div>
            </button>
          )}
          {!user && (
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigate("/auth", { state: { isFlipped: true } });
              }}
              className="w-full text-gray-700 text-[14px] hover:bg-gray-100 rounded-md px-8 py-3 transition"
            >
              <div className="flex items-center gap-2 cursor-pointer">
                <LuUserRoundPlus />
                Sign Up
              </div>
            </button>
          )}
        </div>
        {/*Navigation Links for Mobile */}
        <div className="flex flex-col justify-between h-[calc(100%-85px)]  py-8">
          <ul className="flex flex-col ">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `block px-8 py-3  text-[14px] font-semibold transition-all duration-200 ${
                      isActive
                        ? " text-blue-600 hover:bg-blue-50 "
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* close sidebar on clicking anywhere */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}

export default Header;
