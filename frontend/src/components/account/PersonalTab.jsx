import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext.jsx";
import { CiCamera } from "react-icons/ci";

const inputClass = (isEditing) =>
  `w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition ${
    isEditing
      ? "focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
      : "cursor-auto"
  }`;

export function PersonalTab({ user, sidebarItems, activeTab, onTabChange }) {
  const { updateUser, setUser } = useAuth();

  // State to track if the form is in edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Function to handle profile photo change
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, image: imgURL }));
  };

  // State for date of birth
  const [selectedDate, setSelectedDate] = useState(
    user.dob ? new Date(user.dob) : null,
  );
  const today = new Date();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phoneNumber || "",
      gender: user.gender || "",
      dob: user.dob || "",
    },
  });

  const resetValues = () => ({
    name: user.name,
    email: user.email,
    phone: user.phoneNumber || "",
    gender: user.gender || "",
    dob: user.dob || "",
  });

  const onSubmit = (data) => {
    updateUser({
      name: data.name,
      email: data.email,
      phoneNumber: data.phone,
      gender: data.gender,
      dob: data.dob,
    });
    setIsEditing(false);
    toast.success("Personal details updated!");
  };

  const handleCancel = () => {
    reset(resetValues());
    setIsEditing(false);
  };

  return (
    <>
      {/* Avatar + Edit header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative inline-block">
          <div>
            <img
              src={user.image}
              alt="User Avatar"
              className="h-24 w-24 rounded-full border-2 border-white object-cover shadow-md"
            />
            {isEditing && (
              <div>
                <label
                  htmlFor="profile-photo"
                  className="absolute right-0 bottom-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-blue-600"
                  title="Change profile photo"
                >
                  <CiCamera size={18} />
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profile-photo"
                  onChange={handlePhotoChange}
                />
              </div>
            )}
          </div>

          <div className="group/icon absolute -top-1 -right-3">
            <button className="lg:hidden flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-50 hover:text-blue-600">
              <RiArrowDropDownLine size={22} />
            </button>

            <div className="invisible absolute top-full left-1/2 z-20 mt-2 -translate-x-1/2 group-hover/icon:visible">
              <div className="w-48 overflow-hidden rounded-lg bg-white text-[13px] text-gray-700 shadow-lg ring-1 ring-black/5">
                <div className="h-0.5 bg-linear-to-r from-blue-500 to-blue-300"></div>
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex w-full cursor-pointer items-center gap-3 border-b border-gray-100 px-5 py-3 text-[12px] transition-all ${
                      activeTab === item.id
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex cursor-pointer items-center justify-center gap-2 self-start rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 sm:self-auto"
          >
            <FaRegEdit />
            <span>Edit</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCancel}
            className="cursor-pointer self-start rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 sm:self-auto"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-800">
            Full Name
          </label>

          <input
            {...register("name", { required: "Full name is required" })}
            id="name"
            type="text"
            readOnly={!isEditing}
            spellCheck="false"
            className={inputClass(isEditing)}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-slate-800">
            Phone Number
          </label>

          <input
            {...register("phone", {
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Phone number must be 10 digits",
              },
            })}
            id="phone"
            type="tel"
            placeholder="not added"
            readOnly={!isEditing}
            className={inputClass(isEditing)}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-800">
            Email Address
          </label>

          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
            })}
            id="email"
            type="email"
            readOnly={!isEditing}
            className={inputClass(isEditing)}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="gender"
            className="text-sm font-medium text-slate-800"
          >
            Gender
          </label>

          {isEditing ? (
            <select
              {...register("gender")}
              id="gender"
              className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <input
              {...register("gender")}
              id="gender"
              type="text"
              placeholder="not specified"
              value={user.gender || ""}
              readOnly
              className={inputClass(false)}
            />
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2 md:w-1/2">
          <label htmlFor="dob" className="text-sm font-medium text-slate-800">
            Date of Birth
          </label>
          <div className="relative w-full flex items-center ">
            <FiCalendar
              className="absolute z-10  right-3 text-gray-400"
              size={16}
            />
            {isEditing ? (
              <DatePicker
                {...register("dob")}
                id="dob"
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setValue("dob", date.toISOString());
                }}
                maxDate={today}
                placeholderText="Select date"
                wrapperClassName="w-full"
                className={inputClass(isEditing)}
              />
            ) : (
              <input
                {...register("dob")}
                id="dob"
                type="text"
                value={selectedDate ? selectedDate.toLocaleDateString() : ""}
                placeholder="not added"
                readOnly
                className={inputClass(false)}
              />
            )}
          </div>
        </div>
        {isEditing && (
          <div className="flex gap-3 md:col-span-2">
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </>
  );
}
