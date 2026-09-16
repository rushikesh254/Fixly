import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext.jsx";

const categoryOptions = [
  "Cleaning",
  "Repairing",
  "Installation",
  "Tech services",
  "Personal Services",
  "Home Improvement",
  "Food Services",
];

const inputClass = (isEditing) =>
  `w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition ${
    isEditing
      ? "focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
      : "cursor-auto"
  }`;

function ProviderInfo() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [category, setCategory] = useState(user?.category ?? "");

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      providerName: user.providerName,
      bio: user.bio,
      experience: user.experience,
    },
  });

  const resetValues = () => ({
    providerName: user.providerName,
    bio: user.bio,
    experience: user.experience,
  });

  const [coverImage, setCoverImage] = useState(user.coverImage);
  const [galleryImages, setGalleryImages] = useState([...user.galleryImages]);

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImage(URL.createObjectURL(file));
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((f) => URL.createObjectURL(f));
    setGalleryImages((prev) => [...prev, ...newImages]);
  };

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    if (newCategory !== category && user.services?.length > 0) {
      const confirmChange = window.confirm(
        "Changing the category will remove all your existing services. Do you want to proceed?",
      );
      if (confirmChange) {
        updateUser({ services: [] });
        setGalleryImages([]);
      } else {
        return;
      }
    }
    setCategory(newCategory);
  };

  const handleCancel = () => {
    reset(resetValues());
    setCategory(user?.category ?? "");
    setCoverImage(user.coverImage);
    setGalleryImages([...user.galleryImages]);
    setIsEditing(false);
  };

  const onSubmit = (data) => {
    updateUser({
      providerName: data.providerName,
      coverImage,
      galleryImages,
      category,
      bio: data.bio,
      experience: data.experience,
    });
    setIsEditing(false);
    toast.success("Provider information updated successfully!");
  };

  return (
    <>
      {/* Edit */}
      <div className="flex justify-end">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex -translate-y-20 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
          >
            <FaRegEdit />
            <span>Edit</span>
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="-translate-y-20 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
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
        {/* Business Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800">
            Business Name
          </label>
          <input
            {...register("providerName")}
            type="text"
            readOnly={!isEditing}
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

        {/* Category */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800">Category</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            disabled={!isEditing}
            className={`${inputClass(isEditing)} cursor-pointer ${
              !isEditing ? "cursor-auto" : ""
            }`}
          >
            <option value="">Select category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
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

export default ProviderInfo;
