import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function PasswordTab() {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    toast.success("Password changed successfully!");
    reset();
  };

  const fieldClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100";

  return (
    <div className="max-w-xl">
      <p className="mb-6 text-[13px] text-gray-500">
        Your password must be at least 6 characters long and should not be
        shared with anyone.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="currentPassword"
            className="text-sm font-medium text-slate-800"
          >
            Current Password
          </label>
          <input
            {...register("currentPassword", {
              required: "Current password is required",
            })}
            id="currentPassword"
            type="password"
            placeholder="Enter current password"
            className={fieldClass}
          />
          {errors.currentPassword && (
            <p className="text-xs text-red-500 absolute top-1 right-0">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="newPassword"
            className="text-sm font-medium text-slate-800"
          >
            New Password
          </label>
          <input
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            className={fieldClass}
          />
          {errors.newPassword && (
            <p className="text-xs text-red-500 absolute top-1 right-0">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 relative ">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-800"
          >
            Confirm New Password
          </label>
          <input
            {...register("confirmPassword", {
              required: "Please confirm your new password",
              validate: (value) =>
                value === getValues("newPassword") || "Passwords do not match",
            })}
            id="confirmPassword"
            type="password"
            placeholder="Re-enter new password"
            className={fieldClass}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 absolute top-1 right-0">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="mt-2 cursor-pointer rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
