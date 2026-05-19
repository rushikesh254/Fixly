import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import PrimaryBtn from "./PrimaryBtn";
import SecondaryBtn from "./SecondaryBtn";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/auth") {
    return null;
  }

  return (
    <div className="absolute top-0 left-0  z-20 px-15 py-5  w-full flex items-center justify-between">
      <Link className="font-bold text-2xl text-blue-600 brightness-150" to="/">
        FIXLY
      </Link>

      <div className=" text-white">
        <ul className="flex gap-8 ">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-semibold hover:underline ${isActive ? "text-blue-600 font-bold" : "text-white"}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `font-semibold hover:underline ${isActive ? "text-blue-600 font-bold" : "text-white"}`
              }
            >
              Services
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/providers"
              className={({ isActive }) =>
                `font-semibold hover:underline ${isActive ? "text-blue-600 font-bold" : "text-white"}`
              }
            >
              Providers
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `font-semibold hover:underline ${isActive ? "text-blue-600 font-bold" : "text-white"}`
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `font-semibold hover:underline ${isActive ? "text-blue-600 font-bold" : "text-white"}`
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="flex gap-4">
        <PrimaryBtn
          btn="Login"
          onclick={() => {
            navigate("/auth", { state: { isFlipped: false } });
          }}
        />
        <SecondaryBtn
          btn="Sign Up"
          onclick={() => {
            navigate("/auth", { state: { isFlipped: true } });
          }}
        />
      </div>
    </div>
  );
}

export default Header;
