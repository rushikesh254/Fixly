import { useForm } from "react-hook-form";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import bg from "../../assets/bg.svg";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function AuthCard({ isFlipped, setIsFlipped }) {
  // const [isFlipped, setIsFlipped] = useState(false);

  // React Hook Form for Login
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    getValues,
    formState: { errors: loginErrors },
  } = useForm();

  // React Hook Form for Signup
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm();

  // Access login function from AuthContext
  const { login } = useAuth();

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

      <div className="w-100 h-120  relative z-10 perspective">
        <div
          className={`relative  w-full h-full duration-500 ease-in-out transform-style ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* LOGIN CARD */}
          <div className="absolute bg-white w-full h-full backface-hidden px-6  rounded-2xl shadow-2xl">
            <Link
              className="text-sm flex items-center hover:text-blue-600 text-gray-500 mb-1 "
              to="/"
            >
              <div className=" text-blue-500">
                <IoIosArrowBack size={20} />
              </div>
              <img src={logo} alt="Logo" className="w-32" />
            </Link>

            <h2 className="text-2xl font-semibold mb-2 text-left ">
              Welcome Back!
            </h2>

            <form
              onSubmit={handleLoginSubmit(() => {
                login();
                navigate("/user/dashboard");
                toast.success("Welcome back! You have logged in successfully.");
              })}
            >
              <div className="relative pb-2">
                <label htmlFor="email" className="text-sm font-semibold ">
                  Email
                </label>
                <input
                  {...registerLogin("email", { required: "Email is required" })}
                  type="email"
                  id="email"
                  placeholder="you@gmail.com"
                  spellCheck="false"
                  className="w-full p-2 border border-gray-300 rounded mt-1.5 focus:outline-none  text-[13px]"
                />
                {loginErrors.email && (
                  <p className="absolute top-2 right-1 text-red-500 text-[13px]">
                    {loginErrors.email.message}
                  </p>
                )}
              </div>
              <div className="relative pb-2 pt-1">
                <label htmlFor="password" className="text-sm font-semibold ">
                  Password
                </label>
                <input
                  {...registerLogin("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="w-full p-2  border border-gray-300 rounded mt-1.5 focus:outline-none   text-[13px]"
                />
                {loginErrors.password && (
                  <p className="absolute top-3 right-1 text-red-500 text-[13px]">
                    {loginErrors.password.message}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between cursor-pointer">
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

              <button className="w-full bg-blue-500 text-white mt-6 py-2 rounded cursor-pointer hover:bg-blue-600">
                Login
              </button>
            </form>

            <p className="text-sm text-center mt-2">
              Don’t have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setIsFlipped(true)}
              >
                Sign up
              </span>
            </p>
          </div>

          {/* SIGNUP CARD */}
          <div className="absolute w-full h-full backface-hidden bg-white px-6 overflow-hidden  rounded-2xl shadow-2xl rotate-y-180">
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
              onSubmit={handleSignupSubmit(() => {
                login();
                navigate("/user/dashboard");
                toast.success("Account created successfully!");
              })}
            >
              <div className="relative pb-2">
                <label htmlFor="name" className="text-sm font-semibold ">
                  Name
                </label>
                <input
                  {...registerSignup("name", { required: "Name is required" })}
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  spellCheck="false"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none mt-1 text-[13px] "
                />
                {signupErrors.name && (
                  <p className="absolute top-2 right-1 text-red-500 text-[13px]">
                    {signupErrors.name.message}
                  </p>
                )}
              </div>
              <div className="relative pb-2">
                <label htmlFor="email" className="text-sm font-semibold ">
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
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none mt-1 text-[13px] "
                />
                {signupErrors.email && (
                  <p className="absolute top-2 right-1 text-red-500 text-[13px]">
                    {signupErrors.email.message}
                  </p>
                )}
              </div>
              <div className="relative pb-2">
                <label htmlFor="password" className="text-sm font-semibold ">
                  Password
                </label>
                <input
                  {...registerSignup("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none mt-1 text-[13px] "
                />
                {signupErrors.password && (
                  <p className="absolute top-2 right-1 text-red-500 text-[13px]">
                    {signupErrors.password.message}
                  </p>
                )}
              </div>
              <div className="relative pb-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold "
                >
                  Confirm Password
                </label>
                <input
                  {...registerSignup("confirmPassword", {
                    required: "Confirm your password",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  })}
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none mt-1 text-[13px]"
                />
                {signupErrors.confirmPassword && (
                  <p className="absolute top-2 right-1 text-red-500 text-[13px]">
                    {signupErrors.confirmPassword.message}
                  </p>
                )}
              </div>
              <button className="w-full bg-blue-500 text-white py-2 mt-4 rounded hover:bg-blue-600 cursor-pointer">
                Sign Up
              </button>
            </form>
            <p className="text-sm text-center mt-2">
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
