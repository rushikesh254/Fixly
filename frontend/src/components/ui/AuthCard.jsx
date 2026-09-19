import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff, FiMail } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import bg from "../../assets/bg.svg";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext.jsx";

function AuthCard({ initialFlipped = false }) {
  const [isFlipped, setIsFlipped] = useState(initialFlipped);

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email verification ("check your email") screen
  const [showEmailSentScreen, setShowEmailSentScreen] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState("");
  const [emailSendFailed, setEmailSendFailed] = useState(false);
  const [resending, setResending] = useState(false);

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
  const { login, signup, resendVerification, googleLogin } = useAuth();

  const navigate = useNavigate();

  const handleLogin = handleLoginSubmit(async (data) => {
    try {
      const loggedInUser = await login(data.email, data.password);
      navigate(`/${loggedInUser.role}/dashboard`);
      toast.success("Welcome back! You have logged in successfully.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    }
  });

  const handleSignup = handleSignupSubmit(async (data) => {
    try {
      const res = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      setSignedUpEmail(data.email);
      setEmailSendFailed(res.emailSent === false);
      setShowEmailSentScreen(true);
      if (res.emailSent === false) {
        toast.error("Email not sent. Try again.");
      } else {
        toast.success("Email sent. Check your inbox!");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Sign up failed. Please try again.",
      );
    }
  });

  const handleResendEmail = async () => {
    if (resending || !signedUpEmail) return;
    setResending(true);
    try {
      await resendVerification(signedUpEmail);
      setEmailSendFailed(false);
      toast.success("Email sent. Check your inbox!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Couldn't resend. Try again.",
      );
    } finally {
      setResending(false);
    }
  };

  const loadGoogleScript = () =>
    new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) return resolve();
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Google script load failed"));
      document.head.appendChild(script);
    });

  const handleGoogleLogin = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error("Google sign-in is not configured yet.");
      return;
    }
    try {
      await loadGoogleScript();
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const loggedInUser = await googleLogin(response.credential);
            navigate(`/${loggedInUser.role}/dashboard`);
            toast.success("Welcome back! You have logged in successfully.");
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Google sign-in failed.",
            );
          }
        },
      });
      window.google.accounts.id.prompt();
    } catch {
      toast.error("Failed to load Google sign-in.");
    }
  };

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
        {showEmailSentScreen ? (
          <div className="absolute inset-0 bg-white px-6 py-3 rounded-2xl shadow-2xl flex flex-col">
            <Link
              className="text-sm flex items-center hover:text-blue-600 text-gray-500 mb-2 "
              to="/"
            >
              <div className=" text-blue-500">
                <IoIosArrowBack size={20} />
              </div>
              <img src={logo} alt="Logo" className="w-32" />
            </Link>

            <div className="flex-1 flex flex-col items-center justify-center text-center -mt-4">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-5">
                <FiMail size={36} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Check your email</h2>
              <p className="text-sm text-gray-600 max-w-60">
                We sent a verification link to{" "}
                <span className="font-semibold text-gray-800">
                  {signedUpEmail}
                </span>
                .
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Don't see it? Check your spam folder.
              </p>
              {emailSendFailed && (
                <p className="text-xs text-red-500 mt-2">
                  We couldn't send the email. Tap below to try again.
                </p>
              )}
              <button
                onClick={handleResendEmail}
                disabled={resending}
                className="mt-5 bg-blue-500 text-white text-sm px-8 py-2.5 rounded cursor-pointer hover:bg-blue-600 disabled:opacity-60"
              >
                {resending ? "Sending..." : "Resend email"}
              </button>
            </div>

            <p className="text-sm text-center pb-2">
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => {
                  setShowEmailSentScreen(false);
                  navigate("/login");
                }}
              >
                Back to login
              </span>
            </p>
          </div>
        ) : (
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

            <form onSubmit={handleLogin}>
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
                <div />
                <div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-gray-600 hover:underline cursor-pointer float-right"
                  >
                    Forgot password?
                  </Link>
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

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded hover:bg-gray-50 cursor-pointer transition"
            >
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

            <form onSubmit={handleSignup}>
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
                        validate: {
                          length: (v) =>
                            v.length >= 8 ||
                            "Password must be at least 8 characters",
                          uppercase: (v) =>
                            /[A-Z]/.test(v) ||
                            "Password must contain an uppercase letter",
                          lowercase: (v) =>
                            /[a-z]/.test(v) ||
                            "Password must contain a lowercase letter",
                          number: (v) =>
                            /[0-9]/.test(v) ||
                            "Password must contain a number",
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

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded hover:bg-gray-50 cursor-pointer transition"
            >
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
        )}
      </div>
    </div>
  );
}

export default AuthCard;
