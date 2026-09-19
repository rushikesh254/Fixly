import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import bg from "../../assets/bg.svg";
import logo from "../../assets/logo.png";
import { resetPassword } from "../../api/auth";
import { getApiErrorMessage } from "../../utils/apiError";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      const res = await resetPassword(token, data.newPassword);
      toast.success(
        res.data?.message || "Password reset successful. Please log in.",
      );
      navigate("/login");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not reset password."));
    } finally {
      setSubmitting(false);
    }
  });

  const passwordRules = {
    required: "Password is required",
    validate: {
      length: (v) =>
        v.length >= 8 || "Password must be at least 8 characters",
      uppercase: (v) =>
        /[A-Z]/.test(v) || "Password must contain an uppercase letter",
      lowercase: (v) =>
        /[a-z]/.test(v) || "Password must contain a lowercase letter",
      number: (v) => /[0-9]/.test(v) || "Password must contain a number",
    },
  };

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

      <div className="w-125 relative z-10 bg-white px-6 py-3 rounded-2xl shadow-2xl">
        <Link
          className="text-sm flex items-center hover:text-blue-600 text-gray-500 mb-1 "
          to="/login"
        >
          <div className=" text-blue-500">
            <IoIosArrowBack size={20} />
          </div>
          <img src={logo} alt="Logo" className="w-32" />
        </Link>

        <div className="py-6">
          <h2 className="text-2xl font-semibold mb-3 text-left ">
            Set a new password
          </h2>
          <p className="text-sm text-gray-600 mb-5">
            Choose a strong password for your account.
          </p>

          <form onSubmit={onSubmit}>
            <div className="relative mb-6">
              <label htmlFor="newPassword" className="text-sm font-semibold">
                New Password
              </label>
              <div className="relative">
                <input
                  {...register("newPassword", passwordRules)}
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  placeholder="New Password"
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none mt-1.5 text-[13px] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="absolute right-1 text-red-500 text-[13px]">
                  {errors.newPassword.message}
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
                  {...register("confirmPassword", {
                    required: "Confirm your password",
                    validate: (value) =>
                      value === getValues("newPassword") ||
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
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="absolute right-1 text-red-500 text-[13px]">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-500 text-white py-2.5 rounded hover:bg-blue-600 cursor-pointer disabled:opacity-60"
            >
              {submitting ? "Resetting..." : "Reset password"}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Request a new link
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;