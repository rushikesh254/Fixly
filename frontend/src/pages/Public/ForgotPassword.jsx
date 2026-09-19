import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMail } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import bg from "../../assets/bg.svg";
import logo from "../../assets/logo.png";
import { forgotPassword } from "../../api/auth";
import { getApiErrorMessage } from "../../utils/apiError";

function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setSubmitted(true);
      toast.success(res.data?.message || "Reset email sent. Check your inbox.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not send reset email."));
    }
  });

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <img
          src={bg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover blur-sm "
        />
        <div className="absolute inset-0 bg-black/60 "></div>
      </div>

      <div className="w-125 relative z-10">
        <div className="bg-white px-6 py-3 rounded-2xl shadow-2xl">
          <Link
            className="text-sm flex items-center hover:text-blue-600 text-gray-500 mb-1 "
            to="/"
          >
            <div className=" text-blue-500">
              <IoIosArrowBack size={20} />
            </div>
            <img src={logo} alt="Logo" className="w-32" />
          </Link>

          {submitted ? (
            <div className="py-8 text-center">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5">
                <FiMail size={36} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Check your email</h2>
              <p className="text-sm text-gray-600 max-w-80 mx-auto">
                If an account exists for{" "}
                <span className="font-semibold text-gray-800">
                  {submittedEmail}
                </span>
                , a password reset link has been sent. It expires in 15 minutes.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Don't see it? Check your spam folder.
              </p>
              <div className="mt-6 flex flex-col items-center gap-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-500 hover:underline"
                  onClick={() => setSubmitted(false)}
                >
                  Send another link
                </Link>
                <Link
                  to="/login"
                  className="mt-4 bg-blue-500 text-white text-sm px-8 py-2.5 rounded cursor-pointer hover:bg-blue-600"
                >
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-6">
              <h2 className="text-2xl font-semibold mb-3 text-left ">
                Forgot password?
              </h2>
              <p className="text-sm text-gray-600 mb-5">
                Enter the email linked to your account and we'll send you a link
                to reset your password.
              </p>

              <form onSubmit={onSubmit}>
                <div className="relative pb-4">
                  <label htmlFor="email" className="text-sm font-semibold">
                    Email
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    type="email"
                    id="email"
                    placeholder="you@gmail.com"
                    spellCheck="false"
                    className="w-full p-2.5 border border-gray-300 rounded mt-1.5 focus:outline-none text-[13px]"
                  />
                  {errors.email && (
                    <p className="absolute top-2 right-1 text-red-500 text-[13px]">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2.5 rounded cursor-pointer hover:bg-blue-600 mt-4"
                >
                  Send reset link
                </button>
              </form>

              <p className="text-sm text-center mt-4">
                Remembered it?{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                  Back to login
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;