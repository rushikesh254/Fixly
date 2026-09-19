import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { changePassword } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../utils/apiError";

export function PasswordTab() {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const res = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      reset();
      toast.success(res.data.message || "Password changed successfully!");
      // the server invalidates every session on a password change
      await logout();
      navigate("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not change your password."));
    } finally {
      setIsSaving(false);
    }
  };

  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fieldClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100";

  return (
    <div className="max-w-xl">
      <p className="mb-6 text-[13px] text-gray-500">
        Your password must be at least 8 characters long, include an uppercase
        letter, a lowercase letter and a number, and should not be shared with
        anyone.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Current Password */}
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="currentPassword"
            className="text-sm font-medium text-slate-800"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              {...register("currentPassword", {
                required: "Current password is required",
              })}
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter current password"
              className={fieldClass}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition cursor-pointer"
            >
              {showCurrentPassword ? (
                <FiEyeOff size={18} />
              ) : (
                <FiEye size={18} />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-xs text-red-500 absolute top-1 right-0">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="newPassword"
            className="text-sm font-medium text-slate-800"
          >
            New Password
          </label>
          <div className="relative">
            <input
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: {
                  hasUpper: (value) =>
                    /[A-Z]/.test(value) || "Add an uppercase letter",
                  hasLower: (value) =>
                    /[a-z]/.test(value) || "Add a lowercase letter",
                  hasNumber: (value) => /[0-9]/.test(value) || "Add a number",
                },
              })}
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              className={fieldClass}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition cursor-pointer"
            >
              {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-500 absolute top-1 right-0">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="flex flex-col gap-2 relative ">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-800"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === getValues("newPassword") ||
                  "Passwords do not match",
              })}
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter new password"
              className={fieldClass}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            <p className="text-xs text-red-500 absolute top-1 right-0">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSaving}
            className="mt-2 cursor-pointer rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
