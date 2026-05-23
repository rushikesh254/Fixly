import { useEffect } from "react";
import { BsLinkedin, BsTwitterX, BsYoutube } from "react-icons/bs";
import { FaFacebookF, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { LuMapPin } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

function Footer() {
  const location = useLocation();

  if (location.pathname === "/auth") return null;

  useEffect(() => {
    if (location.hash === "#testimonials") {
      const element = document.getElementById("testimonials");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <footer className="bg-[#0F2F66] text-gray-300 py-12 px-6 sm:px-10 lg:px-16 border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-20 justify-between">
        <div className="flex flex-col lg:w-1/3">
          <Link
            to=""
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src={logo}
              alt="Fixly Logo"
              className="w-36 brightness-150 mb-4 cursor-auto"
            />
          </Link>
          <p className="text-sm leading-relaxed text-gray-400 mb-6">
            Fast and reliable home services at your fingertips. Book now and
            experience the absolute convenience of Fixly!!
          </p>
          <div className="flex space-x-4">
            <Link to="#" className="">
              <FaFacebookF className="w-4 h-4 text-gray-400 hover:text-white hover:scale-105" />
            </Link>
            <Link to="#" className="">
              <BsTwitterX className="w-4 h-4 text-gray-400 hover:text-white hover:scale-105" />
            </Link>
            <Link to="#" className="">
              <FaInstagram className="w-4 h-4 text-gray-400 hover:text-white hover:scale-105  " />
            </Link>
            <Link to="#" className="">
              <BsYoutube className="w-4 h-4 text-gray-400 hover:text-white hover:scale-105" />
            </Link>
            <Link to="#" className="">
              <BsLinkedin className="w-4 h-4 text-gray-400 hover:text-white hover:scale-105" />
            </Link>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8 lg:ml-20 xl:ml-32">
          <div>
            <h2 className="text-white font-semibold text-lg mb-5">Company</h2>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  to="/about"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "instant" })
                  }
                  className="hover:text-white transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "instant" })
                  }
                  className="hover:text-white transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/#testimonials"
                  className="hover:text-white transition-colors duration-200"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="hover:text-white transition-colors duration-200"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-5">Services</h2>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  to="/services"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "instant" })
                  }
                  className="hover:text-white transition-colors duration-200"
                >
                  All Services
                </Link>
              </li>
              <li>
                <Link
                  to="/services/cleaning"
                  className="hover:text-white transition-colors duration-200"
                >
                  Cleaning
                </Link>
              </li>
              <li>
                <Link
                  to="/services/plumbing"
                  className="hover:text-white transition-colors duration-200"
                >
                  Plumbing
                </Link>
              </li>
              <li>
                <Link
                  to="/services/electrician"
                  className="hover:text-white transition-colors duration-200"
                >
                  Electrician
                </Link>
              </li>
              <li>
                <Link
                  to="/services/cooking"
                  className="hover:text-white transition-colors duration-200"
                >
                  Cooking & Chef
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-5">
              Contact Us
            </h2>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link
                  to="mailto:info@fixly.com"
                  className="flex items-center hover:text-white transition-colors"
                >
                  <IoMdMail className="w-4 h-4 mr-3 text-gray-400" />
                  info@fixly.com
                </Link>
              </li>
              <li>
                <Link
                  to="tel:+11234567890"
                  className="flex items-center hover:text-white transition-colors"
                >
                  <FaPhoneAlt className="w-4 h-4 mr-3 text-gray-400" />
                  +1 (123) 456-7890
                </Link>
              </li>
              <li className="flex items-start">
                <LuMapPin className="w-5 h-5 mr-3 text-gray-400 shrink-0" />
                <span>
                  123 Main Street,
                  <br />
                  Prayagraj,Uttar Pradesh, India 211001
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-700/50 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Fixly. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
