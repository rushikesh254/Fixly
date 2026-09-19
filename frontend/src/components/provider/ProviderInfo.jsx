import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";
import { getCategories } from "../../api/categories";
import { updateMyProviderProfile } from "../../api/providers";
import { getMyServices } from "../../api/services";
import { useAuth } from "../../context/AuthContext.jsx";
import { useFetch } from "../../hooks/useFetch.js";
import { getApiErrorMessage } from "../../utils/apiError.js";

const inputClass = (isEditing) =>
  `w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition ${
    isEditing
      ? "focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
      : "cursor-auto"
  }`;

function ProviderInfo({ provider, onSaved }) {
  const { setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [category, setCategory] = useState(provider?.categoryId ?? "");

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      providerName: provider?.providerName ?? "",
      bio: provider?.bio ?? "",
      experience: provider?.experience ?? "",
    },
  });

  const resetValues = () => ({
    providerName: provider?.providerName ?? "",
    bio: provider?.bio ?? "",
    experience: provider?.experience ?? "",
  });

  // the category list comes from the platform catalogue
  const fetchCategories = useCallback(
    () => getCategories().then((res) => res.data.categories),
    [],
  );
  const { data: categoryOptions } = useFetch(fetchCategories, {
    initialData: [],
  });

  // already uploaded images, kept as urls, plus the files picked in this session
  const [coverImage, setCoverImage] = useState(provider?.coverImage ?? "");
  const [coverFile, setCoverFile] = useState(null);
  const [galleryImages, setGalleryImages] = useState([
    ...(provider?.galleryImages ?? []),
  ]);
  const [galleryFiles, setGalleryFiles] = useState([]);

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverImage(URL.createObjectURL(file));
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryImages((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeGalleryImage = (index) => {
    const removed = galleryImages[index];
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    // a blob url belongs to a file that has not been uploaded yet
    if (removed?.startsWith("blob:")) {
      const blobIndex = galleryImages
        .slice(0, index)
        .filter((img) => img.startsWith("blob:")).length;
      setGalleryFiles((prev) => prev.filter((_, i) => i !== blobIndex));
    }
  };

  const handleCategoryChange = async (e) => {
    const newCategory = e.target.value;
    if (newCategory === category) return;

    // service titles come from the chosen category, so existing services would
    // no longer belong to it
    try {
      const { data } = await getMyServices();
      if (data.count > 0) {
        const confirmChange = window.confirm(
          "Changing the category will no longer match your existing services. Do you want to proceed?",
        );
        if (!confirmChange) return;
      }
    } catch {
      // if the check fails, let the provider continue
    }

    setCategory(newCategory);
  };

  const handleCancel = () => {
    reset(resetValues());
    setCategory(provider?.categoryId ?? "");
    setCoverImage(provider?.coverImage ?? "");
    setCoverFile(null);
    setGalleryImages([...(provider?.galleryImages ?? [])]);
    setGalleryFiles([]);
    setIsEditing(false);
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("providerName", data.providerName || "");
      formData.append("experience", data.experience || "");
      formData.append("bio", data.bio || "");
      formData.append("category", category || "");
      // only the urls that are still in the list are kept, uploads are appended
      formData.append(
        "galleryImages",
        JSON.stringify(galleryImages.filter((img) => !img.startsWith("blob:"))),
      );
      if (coverFile) formData.append("coverImage", coverFile);
      if (!coverFile && !coverImage) formData.append("removeCoverImage", "true");
      galleryFiles.forEach((file) => formData.append("galleryImages", file));

      const { data: res } = await updateMyProviderProfile(formData);

      // keep the header and sidebar in step with the saved values
      setUser((prev) =>
        prev
          ? {
              ...prev,
              providerName: res.provider.providerName || "",
              bio: res.provider.bio || "",
              experience: res.provider.experience || "",
              category: res.provider.category?.name || "",
              categoryId: res.provider.category?._id || "",
              coverImage: res.provider.coverImage || "",
              galleryImages: res.provider.galleryImages || [],
            }
          : prev,
      );

      setCoverFile(null);
      setGalleryFiles([]);
      setIsEditing(false);
      toast.success(
        res.message || "Provider information updated successfully!",
      );
      if (onSaved) onSaved();
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Could not update your information."),
      );
    } finally {
      setIsSaving(false);
    }
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
              <option key={cat._id} value={cat._id}>
                {cat.name}
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
              disabled={isSaving}
              className="cursor-pointer rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </>
  );
}

export default ProviderInfo;
