import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";
import categories from "../../constants/categories.js";
import services from "../../constants/services.js";
import { useAuth } from "../../context/AuthContext.jsx";

const inputClass = (isEditing) =>
  `w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition ${
    isEditing
      ? "focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
      : "cursor-auto"
  }`;

function ServiceInfo() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [includes, setIncludes] = useState([...user.includes]);
  const [tagInput, setTagInput] = useState("");

  const [coverImage, setCoverImage] = useState(user.coverImage);
  const [galleryImages, setGalleryImages] = useState([...user.galleryImages]);

  // initialize form with provider data
  const defaultValues = {
    providerName: user.providerName,
    category: user.category,
    title: user.title,
    price: user.price,
    estimatedDuration: user.estimatedDuration,
    experience: user.provider.experience,
    availableToday: user.availableToday,
    instantBooking: user.instantBooking,
    description: user.description,
    bio: user.provider.bio,
  };

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues,
  });

  const category = watch("category");
  const availableToday = watch("availableToday");
  const instantBooking = watch("instantBooking");

  const filteredServices = services.filter((s) => s.category === category);

  const onCategoryChange = (e) => {
    const value = e.target.value;
    setValue("category", value);
    const matching = services.find((s) => s.category === value);
    setValue("title", matching ? matching.name : "");
  };

  // Cover upload handlers
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImage(URL.createObjectURL(file));
  };

  // Gallery upload handlers
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((f) => URL.createObjectURL(f));
    setGalleryImages((prev) => [...prev, ...newImages]);
  };

  // Remove gallery image handler
  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !includes.includes(val)) {
      setIncludes((prev) => [...prev, val]);
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setIncludes((prev) => prev.filter((t) => t !== tag));
  };

  const resetValues = () => ({
    providerName: user.providerName,
    category: user.category,
    title: user.title,
    price: user.price,
    estimatedDuration: user.estimatedDuration,
    experience: user.provider.experience,
    availableToday: user.availableToday,
    instantBooking: user.instantBooking,
    description: user.description,
    bio: user.provider.bio,
  });

  const onSubmit = (data) => {
    updateUser(
      {
        providerName: data.providerName,
        category: data.category,
        title: data.title,
        price: data.price,
        estimatedDuration: data.estimatedDuration,
        experience: data.provider.experience,
        availableToday: data.availableToday,
        instantBooking: data.instantBooking,
        description: data.description,
        bio: data.provider.bio,
      },
      setIsEditing(false),
      toast.success("Service information updated successfully!"),
    );
  };

  const handleCancel = () => {
    reset(resetValues());
    setIncludes([...user.includes]);
    setCoverImage(user.coverImage);
    setGalleryImages([...user.galleryImages]);
    setIsEditing(false);
  };

  return (
    <>
      {/* Edit */}
      <div className="flex  justify-end">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 -translate-y-20"
          >
            <FaRegEdit />
            <span>Edit</span>
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition -translate-y-20 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Image uploads section */}
      <div className="mb-8 grid grid-cols-1 gap-2 md:grid-cols-2">
        {/* Cover image */}
        <div className="w-100 flex flex-col gap-2">
          <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-blue-400">
            {coverImage ? (
              <img
                src={coverImage}
                alt="Cover"
                className="h-45 w-full object-cover"
              />
            ) : (
              <div className="flex h-40 items-center justify-center text-sm text-slate-400">
                No cover image
              </div>
            )}
            {isEditing && (
              <>
                <label
                  htmlFor="cover-upload"
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 text-sm font-medium text-white opacity-0 transition hover:opacity-100"
                >
                  Change Cover
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="cover-upload"
                  className="hidden"
                  onChange={handleCoverUpload}
                />
              </>
            )}
          </div>
        </div>

        {/* Gallery images */}
        <div className="flex flex-col gap-2">
          <div className="w-100 grid grid-cols-2 gap-2">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-lg border border-slate-200"
              >
                <img
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="h-22.5 w-full object-cover"
                />
                {isEditing && (
                  <button
                    onClick={() => removeGalleryImage(i)}
                    className="absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <RxCross1 size={10} />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <label className="flex h-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-blue-400 hover:text-blue-500">
                <span className="text-xl">+</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGalleryUpload}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Form fields */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
      >
        {/* Service Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800">
            Service Name
          </label>
          <input
            {...register("providerName")}
            type="text"
            readOnly={!isEditing}
            className={inputClass(isEditing)}
          />
        </div>

        {/* Service Category */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800">
            Service Category
          </label>
          {isEditing ? (
            <select
              {...register("category")}
              onChange={onCategoryChange}
              className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={category}
              readOnly
              className={inputClass(false)}
            />
          )}
        </div>

        {/* Service Offered */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800">
            Service Offered
          </label>
          {isEditing ? (
            <select
              {...register("title")}
              className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            >
              {filteredServices.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={watch("title")}
              readOnly
              className={inputClass(false)}
            />
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800">
            Price (₹)
          </label>
          <input
            {...register("price")}
            type="number"
            readOnly={!isEditing}
            className={inputClass(isEditing)}
          />
        </div>

        {/* Estimated Duration */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800">
            Estimated Duration
          </label>
          <input
            {...register("estimatedDuration")}
            type="text"
            readOnly={!isEditing}
            placeholder="e.g. 2-3 hours"
            className={inputClass(isEditing)}
          />
        </div>

        {/* Experience */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800">
            Experience
          </label>
          <input
            {...register("experience")}
            type="text"
            readOnly={!isEditing}
            placeholder="e.g. 5 years"
            className={inputClass(isEditing)}
          />
        </div>

        {/* Available Today */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Available Today
            </p>
            <p className="mt-0.5 text-[13px] text-gray-500">
              Show as available for same-day bookings
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              isEditing && setValue("availableToday", !availableToday)
            }
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
              availableToday ? "bg-blue-600" : "bg-gray-300"
            } ${isEditing ? "cursor-pointer" : "cursor-auto"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                availableToday ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        {/* Instant Booking */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Instant Booking
            </p>
            <p className="mt-0.5 text-[13px] text-gray-500">
              Allow customers to book without provider confirmation
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              isEditing && setValue("instantBooking", !instantBooking)
            }
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
              instantBooking ? "bg-blue-600" : "bg-gray-300"
            } ${isEditing ? "cursor-pointer" : "cursor-auto"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                instantBooking ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-800">
            Description
          </label>
          <textarea
            {...register("description")}
            readOnly={!isEditing}
            rows={3}
            placeholder="Short service description shown to customers"
            className={`${inputClass(isEditing)} resize-none`}
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-800">Bio</label>
          <textarea
            {...register("bio")}
            readOnly={!isEditing}
            rows={4}
            placeholder="Your professional intro shown on your public listing"
            className={`${inputClass(isEditing)} resize-none`}
          />
        </div>

        {/* What's Included */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-800">
            What's Included
          </label>

          <div className="flex flex-wrap gap-2">
            {includes.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-[13px] font-medium text-blue-700"
              >
                {tag}
                {isEditing && (
                  <button
                    onClick={() => removeTag(tag)}
                    className="cursor-pointer text-blue-400 transition hover:text-blue-600"
                  >
                    <RxCross1 size={12} />
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Add an item (e.g. Dusting)"
                className="w-full max-w-sm rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={addTag}
                className="shrink-0 cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Save button */}
        {isEditing && (
          <div className="md:col-span-2">
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </>
  );
}

export default ServiceInfo;
