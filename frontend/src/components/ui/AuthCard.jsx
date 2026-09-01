import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import bg from "../../assets/bg.svg";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext.jsx";

function AuthCard({ isFlipped, setIsFlipped }) {
  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // React Hook Form for Login
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm();

  // React Hook Form for Signup
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    getValues: getSignupValues,
    formState: { errors: signupErrors },
  } = useForm();

  // Access login function from AuthContext
  const { login, signup } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="absolute inset-0  h-full w-full overflow-hidden">
        <img
          src={bg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover blur-sm "
        />
        <div className="absolute inset-0 bg-black/60 "></div>
      </div>

      <div className="w-125 h-145  relative z-10 perspective">
        <div
          className={`relative  w-full h-full duration-500 ease-in-out transform-style ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* LOGIN CARD */}
          <div className="absolute bg-white w-full h-full backface-hidden px-6 py-3 rounded-2xl shadow-2xl">
            <Link
              className="text-sm flex items-center hover:text-blue-600 text-gray-500 mb-1 "
              to="/"
            >
              <div className=" text-blue-500">
                <IoIosArrowBack size={20} />
              </div>
              <img src={logo} alt="Logo" className="w-32" />
            </Link>

            <h2 className="text-2xl font-semibold mb-4 text-left ">
              Welcome Back!
            </h2>

            <form
              onSubmit={handleLoginSubmit(() => {
                const loggedInUser = login();
                navigate(`/${loggedInUser.role}/dashboard`);
                toast.success("Welcome back! You have logged in successfully.");
              })}
            >
              <div className="relative pb-4">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  {...registerLogin("email", { required: "Email is required" })}
                  type="email"
                  id="email"
                  placeholder="you@gmail.com"
                  spellCheck="false"
                  className="w-full p-2.5 border border-gray-300 rounded mt-1.5 focus:outline-none text-[13px]"
                />
                {loginErrors.email && (
                  <p className="absolute top-2 right-1 text-red-500 text-[13px]">
                    {loginErrors.email.message}
                  </p>
                )}
              </div>
              <div className="relative pb-3">
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...registerLogin("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type={showLoginPassword ? "text" : "password"}
                    id="password"
                    placeholder="Password"
                    className="w-full p-2.5 border border-gray-300 rounded mt-1.5 focus:outline-none text-[13px] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition cursor-pointer"
                  >
                    {showLoginPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="absolute top-3 right-1 text-red-500 text-[13px]">
                    {loginErrors.password.message}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between cursor-pointer pb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="mr-2 h-4 w-4 cursor-pointer rounded border border-gray-300 transition-colors  focus:border-[#1E4ED8] focus:outline-none "
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <div>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:underline cursor-pointer float-right"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <button className="w-full bg-blue-500 text-white py-2.5 rounded cursor-pointer hover:bg-blue-600 mt-4">
                Login
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded hover:bg-gray-50 cursor-pointer transition">
              <FcGoogle size={20} />
              <span className="text-sm font-medium">Continue with Google</span>
            </button>

            <p className="text-sm text-center mt-4">
              Don't have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setIsFlipped(true)}
              >
                Sign up
              </span>
            </p>
          </div>

          {/* SIGNUP CARD */}
          <div className="absolute w-full h-full backface-hidden bg-white px-6 py-3 overflow-hidden rounded-2xl shadow-2xl rotate-y-180">
            <Link
              className="text-sm flex items-center hover:text-blue-600 text-gray-500 "
              to="/"
            >
              <div className=" text-blue-500">
                <IoIosArrowBack size={20} />
              </div>
              <img src={logo} alt="Logo" className="w-32" />
            </Link>

            <form
              onSubmit={handleSignupSubmit((data) => {
                signup(data.role);
                navigate(
                  `/${data.role === "user" ? "user" : "provider"}/dashboard`,
                );
                toast.success("Account created successfully!");
              })}
            >
              <div className="grid grid-cols-2 gap-x-3">
                <div className="relative mb-6">
                  <label htmlFor="name" className="text-sm font-semibold">
                    Name
                  </label>
                  <input
                    {...registerSignup("name", {
                      required: "Name is required",
                    })}
                    type="text"
                    id="name"
                    placeholder="Your Name"
                    spellCheck="false"
                    className="w-full p-2.5 border border-gray-300 rounded focus:outline-none mt-1.5 text-[13px]"
                  />
                  {signupErrors.name && (
                    <p className="absolute  right-1 text-red-500 text-[13px]">
                      {signupErrors.name.message}
                    </p>
                  )}
                </div>
                <div className="relative mb-6">
                  <label htmlFor="email" className="text-sm font-semibold">
                    Email
                  </label>
                  <input
                    {...registerSignup("email", {
                      required: "Email is required",
                    })}
                    type="email"
                    id="email"
                    placeholder="you@gmail.com"
                    spellCheck="false"
                    className="w-full p-2.5 border border-gray-300 rounded focus:outline-none mt-1.5 text-[13px]"
                  />
                  {signupErrors.email && (
                    <p className="absolute right-1 text-red-500 text-[13px]">
                      {signupErrors.email.message}
                    </p>
                  )}
                </div>
                <div className="relative mb-6">
                  <label htmlFor="password" className="text-sm font-semibold">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerSignup("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      type={showSignupPassword ? "text" : "password"}
                      id="password"
                      placeholder="Password"
                      className="w-full p-2.5 border border-gray-300 rounded focus:outline-none mt-1.5 text-[13px] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition cursor-pointer"
                    >
                      {showSignupPassword ? (
                        <FiEyeOff size={14} />
                      ) : (
                        <FiEye size={14} />
                      )}
                    </button>
                  </div>
                  {signupErrors.password && (
                    <p className="absolute  right-1 text-red-500 text-[13px]">
                      {signupErrors.password.message}
                    </p>
                  )}
                </div>
                <div className="relative mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerSignup("confirmPassword", {
                        required: "Confirm your password",
                        validate: (value) =>
                          value === getSignupValues("password") ||
                          "Passwords do not match",
                      })}
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      className="w-full p-2.5 border border-gray-300 rounded focus:outline-none mt-1.5 text-[13px] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={14} />
                      ) : (
                        <FiEye size={14} />
                      )}
                    </button>
                  </div>
                  {signupErrors.confirmPassword && (
                    <p className="absolute right-1 text-red-500 text-[13px]">
                      {signupErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="relative mb-6">
                <label className="text-sm font-semibold">I want to</label>
                <div className="grid grid-cols-2 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="user"
                      {...registerSignup("role", {
                        required: "Please select a role",
                      })}
                      className="h-4 w-4 cursor-pointer accent-blue-500"
                    />
                    <span className="text-[13px]">Find Services</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="provider"
                      {...registerSignup("role", {
                        required: "Please select a role",
                      })}
                      className="h-4 w-4 cursor-pointer accent-blue-500"
                    />
                    <span className="text-[13px]">Provide Services</span>
                  </label>
                </div>
                {signupErrors.role && (
                  <p className=" absolute text-red-500 text-[13px]  mt-1">
                    {signupErrors.role.message}
                  </p>
                )}
              </div>
              <button className="w-full bg-blue-500 text-white mt-4 py-2.5 rounded hover:bg-blue-600 cursor-pointer">
                Sign Up
              </button>
            </form>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded hover:bg-gray-50 cursor-pointer transition">
              <FcGoogle size={20} />
              <span className="text-sm font-medium">Continue with Google</span>
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => {
                  setIsFlipped(false);
                }}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthCard;
