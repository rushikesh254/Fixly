import { useForm } from "react-hook-form";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import bg from "../../assets/bg.svg";
import logo from "../../assets/logo.png";

function AuthCard({ isFlipped, setIsFlipped }) {
  // const [isFlipped, setIsFlipped] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
              action=""
              onSubmit={handleSubmit((data) => console.log(data))}
            >
              <div className="relative pb-2">
                <label htmlFor="email" className="text-sm font-semibold ">
                  Email
                </label>
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  id="email"
                  placeholder="you@gmail.com"
                  className="w-full p-2 border rounded mt-1.5 focus:outline-none  text-sm"
                />
                {errors.email && (
                  <p className="absolute top-2 right-1 text-red-500 text-[13px]">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="relative pb-2 pt-1">
                <label htmlFor="password" className="text-sm font-semibold ">
                  Password
                </label>
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="w-full p-2  border rounded mt-1.5 focus:outline-none   text-sm"
                />
                {errors.password && (
                  <p className="absolute top-3 right-1 text-red-500 text-[13px]">
                    {errors.password.message}
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
              action=""
              onSubmit={handleSubmit((data) => console.log(data))}
            >
              <div className="relative pb-2">
                <label htmlFor="name" className="text-sm font-semibold ">
                  Name
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  className="w-full p-1.5 border rounded focus:outline-none mt-1 text-sm"
                />
                {errors.name && (
                  <p className="absolute top-2 right-1 text-red-500 text-[13px]">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="relative pb-2">
                <label htmlFor="email" className="text-sm font-semibold ">
                  Email
                </label>
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  id="email"
                  placeholder="you@gmail.com"
                  className="w-full p-1.5 border rounded focus:outline-none mt-1 text-sm "
                />
                {errors.email && (
                  <p className="absolute top-2 right-1 text-red-500 text-[13px]">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="relative pb-2">
                <label htmlFor="password" className="text-sm font-semibold ">
                  Password
                </label>
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="w-full p-1.5 border rounded focus:outline-none mt-1 text-sm"
                />
                {errors.password && (
                  <p className="absolute top-2 right-1 text-red-500 text-[13px]">
                    {errors.password.message}
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
                  {...register("confirmPassword", {
                    required: "Confirm your password",
                  })}
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full p-1.5 border rounded focus:outline-none mt-1 text-sm"
                />
                {errors.confirmPassword && (
                  <p className="absolute top-2 right-1 text-red-500 text-[13px]">
                    {errors.confirmPassword.message}
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
