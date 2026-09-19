import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CiBadgeDollar,
  CiCirclePlus,
  CiClock1,
  CiEdit,
  CiTrash,
} from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";
import {
  createService,
  deleteService,
  getMyServices,
  updateService,
} from "../../api/services";
import { getServiceTypes } from "../../api/serviceTypes";
import { useFetch } from "../../hooks/useFetch.js";
import { getApiErrorMessage } from "../../utils/apiError.js";
import Loader, { ErrorState } from "../ui/Loader";
import ConfirmDialog from "../ui/ConfirmDialog";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100";

function Toggle({ value, onChange, label, subtext }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2">
      <div>
        <p className="text-[13px] font-semibold text-gray-900">{label}</p>
        <p className="mt-0.5 text-[12px] text-gray-500">{subtext}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
          value ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            value ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

function ServiceForm({ service, provider, onClose, onSaved }) {
  const [includes, setIncludes] = useState([...(service?.includes ?? [])]);
  const [tagInput, setTagInput] = useState("");
  const [availableToday, setAvailableToday] = useState(
    service?.availableToday ?? false,
  );
  const [instantBooking, setInstantBooking] = useState(
    service?.instantBooking ?? false,
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Determine if we are editing an existing service or adding a new one
  const isEdit = Boolean(service);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: service?.title ?? "",
      price: service?.price ?? "",
      duration: service?.estimatedDuration ?? "",
      description: service?.description ?? "",
    },
  });

  const providerCategory = provider?.category ?? "";
  const providerCategoryId = provider?.categoryId ?? "";

  // the titles a provider may publish come from the admin curated catalogue
  const fetchServiceTypes = useCallback(
    () =>
      providerCategoryId
        ? getServiceTypes({ category: providerCategoryId }).then(
            (res) => res.data.serviceTypes,
          )
        : Promise.resolve([]),
    [providerCategoryId],
  );
  const { data: filteredServices } = useFetch(fetchServiceTypes, {
    initialData: [],
  });

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

  const onSubmit = async (data) => {
    if (!providerCategoryId) {
      toast.error("Select a category in Provider Info first.");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", data.title);
      formData.append("description", data.description || data.title);
      formData.append("price", String(Number(data.price)));
      formData.append("category", providerCategoryId);
      formData.append("estimatedDuration", data.duration || "");
      formData.append("includes", JSON.stringify(includes));
      formData.append("availableToday", String(availableToday));
      formData.append("instantBooking", String(instantBooking));

      if (isEdit) {
        await updateService(service.serviceId, formData);
        toast.success("Service updated successfully!");
      } else {
        await createService(formData);
        toast.success("Service added successfully!");
      }
      onSaved();
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save this service."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteService(service.serviceId);
      toast.info("Service deleted successfully!");
      onSaved();
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete this service."));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto   rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Service" : "Add Service"}
          </h3>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <RxCross1 size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {/* category*/}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-slate-800">
              Service Category
            </label>
            <input
              value={providerCategory}
              readOnly
              className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            ></input>
            {filteredServices.length === 0 && (
              <p className="text-[12px] text-amber-600">
                Select a category in Provider Info first.
              </p>
            )}
          </div>
          {/* Service Title */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[13px] font-medium text-slate-800">
              Service Title
            </label>
            <select
              {...register("title", { required: "Title is required" })}
              className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            >
              <option value="">Select service</option>
              {service?.title && (
                <option value={service.title}>{service.title}</option>
              )}
              {filteredServices
                .filter((s) => s.name !== service?.title)
                .map((s) => (
                  <option key={s._id} value={s.name}>
                    {s.name}
                  </option>
                ))}
            </select>
            {errors.title && (
              <p className="text-[12px] text-red-600 absolute right-1 top-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[13px] font-medium text-slate-800">
              Price (₹)
            </label>
            <input
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              type="number"
              placeholder="e.g. 499"
              className={inputClass}
            />
            {errors.price && (
              <p className="text-[12px] text-red-600 absolute right-1 top-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-800">
              Duration
            </label>
            <input
              {...register("duration")}
              type="text"
              placeholder="e.g. 2-3 hours"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[13px] font-medium text-slate-800">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Short service description shown to customers"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Includes */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[13px] font-medium text-slate-800">
              Includes
            </label>

            <div className="flex flex-wrap gap-2">
              {includes.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-1.5 text-[11px] font-medium text-blue-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="cursor-pointer text-blue-400 transition hover:text-blue-600"
                  >
                    <RxCross1 size={12} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                type="text"
                placeholder="e.g. Dusting"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addTag}
                className="shrink-0 cursor-pointer rounded-xl border border-slate-300 px-4 text-[13px] font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Add
              </button>
            </div>
          </div>

          {/* Availability toggles */}
          <Toggle
            value={availableToday}
            onChange={setAvailableToday}
            label="Available Today"
            subtext="Show this service to customers looking for today"
          />
          <Toggle
            value={instantBooking}
            onChange={setInstantBooking}
            label="Instant Booking"
            subtext="Let customers book without waiting for approval"
          />

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 md:col-span-2">
            {isEdit ? (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2.5 text-[13px] font-medium text-red-600 transition hover:bg-red-50"
              >
                <CiTrash size={16} />
                Delete
              </button>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer rounded-full bg-blue-600 px-6 py-2.5 text-[13px] font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Add Service"}
            </button>
          </div>
        </form>
      </div>

      {showDeleteModal && (
        <ConfirmDialog
          title="Delete this service?"
          message={
            <p>
              <span className="font-medium text-gray-900">
                {service?.title}
              </span>{" "}
              will no longer be offered to customers.
            </p>
          }
          cancelLabel="Cancel"
          confirmLabel="Delete"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function MyServices({ provider }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchServices = useCallback(
    () =>
      getMyServices().then((res) =>
        res.data.services.map((service) => ({
          serviceId: service._id,
          title: service.name,
          category: service.category?.name || "",
          price: service.price,
          estimatedDuration: service.estimatedDuration || "",
          description: service.description || "",
          includes: service.includes || [],
          availableToday: Boolean(service.availableToday),
          instantBooking: Boolean(service.instantBooking),
        })),
      ),
    [],
  );

  const {
    data: servicesList,
    loading,
    error,
    refetch,
  } = useFetch(fetchServices, { initialData: [] });

  // Open the add form
  const openAdd = () => {
    setEditing(null);
    setIsOpen(true);
  };

  // Open the edit form with the selected service
  const openEdit = (service) => {
    setEditing(service);
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex justify-between">
        <button
          onClick={openAdd}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-blue-600 px-4.5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <CiCirclePlus size={18} />
          Add Service
        </button>
      </div>

      {loading && <Loader label="Loading your services..." className="mt-6" />}

      {!loading && error && (
        <ErrorState message={error} onRetry={refetch} className="mt-6" />
      )}

      {!loading && !error && servicesList.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
          <CiCirclePlus size={40} className="text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            No services added yet
          </p>
          <p className="mt-1 text-[13px] text-slate-400">
            Add your first service to start offering it to customers.
          </p>
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {servicesList.map((service) => (
              <div
                key={service.serviceId}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {service.title}
                    </h3>
                    <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {service.category}
                    </span>
                  </div>
                  <button
                    onClick={() => openEdit(service)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-100"
                  >
                    <CiEdit size={15} />
                    Edit
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 font-semibold text-gray-900">
                    <CiBadgeDollar size={17} className="text-gray-500" />₹
                    {service.price}
                  </span>
                  {service.estimatedDuration && (
                    <span className="flex items-center gap-1.5 text-[13px] text-gray-600">
                      <CiClock1 size={17} className="text-gray-500" />
                      {service.estimatedDuration}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      service.availableToday
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        service.availableToday
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />
                    Available Today
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      service.instantBooking
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        service.instantBooking
                          ? "bg-emerald-300"
                          : "bg-slate-400"
                      }`}
                    />
                    Instant Booking
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {isOpen && (
        <ServiceForm
          service={editing}
          provider={provider}
          onSaved={refetch}
          onClose={() => {
            setIsOpen(false);
            setEditing(null);
          }}
        />
      )}
    </>
  );
}

export default MyServices;
