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

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (location.pathname === "/auth") {
    return null;
  }

  if (location.pathname === `/services/viewDetails/${id}`) {
    return null;
  }

  return (
    <>
      <div className="absolute -top-3 left-0 z-30 px-6 sm:px-10 lg:px-14   w-full flex items-center justify-between">
        <Link to="/" className="z-50">
          <img src={logo} alt="Logo" className="w-24 sm:w-40" />
        </Link>

        <div className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "Providers", path: "/provider" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition duration-300 ${
                      isActive
                        ? "text-blue-500"
                        : "text-white hover:text-blue-400"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => {
              navigate("/auth", { state: { isFlipped: false } });
            }}
            className="text-white cursor-pointer hover:scale-105 transition duration-300 flex items-center gap-2 font-semibold"
          >
            <FiLogIn />
            Login
          </button>

          <PrimaryBtn
            btn="Sign Up"
            onclick={() => {
              navigate("/auth", { state: { isFlipped: true } });
            }}
          />
        </div>

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
              size={30}
              className="text-white hover:scale-105 transition-transform duration-300"
            />
          )}
        </button>
      </div>

      <div
        className={`fixed top-0 right-0 h-screen w-72 bg-white z-40 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
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

        <div className="border-b border-gray-100">
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              navigate("/auth", { state: { isFlipped: false } });
            }}
            className="w-full  text-gray-700 text-[14px] hover:bg-gray-100 rounded-md px-8 py-3 transition"
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <FiLogIn />
              Login
            </div>
          </button>
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
        </div>

        <div className="flex flex-col justify-between h-[calc(100%-85px)]  py-8">
          <ul className="flex flex-col ">
            {[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "Providers", path: "/provider" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((item, index) => (
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
