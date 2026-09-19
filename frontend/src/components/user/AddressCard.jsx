import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaMapPin } from "react-icons/fa";
import { HiOutlineXMark } from "react-icons/hi2";
import { toast } from "sonner";
import { saveAddress as saveAddressApi } from "../../api/users";
import { useLocate } from "../../hooks/useLocate";
import { getApiErrorMessage } from "../../utils/apiError";

// An account has a single address, so this form both adds it the first time and
// edits it afterwards. Pass `currentAddress` to prefill it.
function AddressCard({ setAddressOpen, onSave, currentAddress }) {
  const isEdit = Boolean(currentAddress);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      label: currentAddress?.label ?? "",
      flat: currentAddress?.flat ?? "",
      street: currentAddress?.street ?? "",
      city: currentAddress?.city ?? "",
      state: currentAddress?.state ?? "",
      pincode: currentAddress?.pincode ?? "",
    },
  });

  const { detect, status, clearLocation, address, userCoords } = useLocate();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (address) {
      setValue(
        "street",
        address.residential || address.suburb || address.road || "",
      );
      setValue("city", address.city || address.town || address.village || "");
      setValue("pincode", address.postcode || "");
      setValue("state", address.state || "");
    }
  }, [address, setValue]);

  // Persist the address on the account so it is available on every device and
  // can prefill the booking form.
  const submitAddress = async (data) => {
    setIsSaving(true);
    try {
      const { data: res } = await saveAddressApi({
        ...data,
        // coordinates are only known when the address was auto-detected, they let
        // the nearby search work for the services a provider publishes
        ...(userCoords
          ? { lat: userCoords.lat, lon: userCoords.lon }
          : currentAddress?.lat !== undefined
            ? { lat: currentAddress.lat, lon: currentAddress.lon }
            : {}),
      });
      if (onSave) onSave(res.address);
      setAddressOpen(false);
      toast.success(res.message || "Address saved successfully!");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save your address."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
        <div className="bg-white relative rounded-lg p-5 w-full max-w-md  mx-4 max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <div
            onClick={() => setAddressOpen(false)}
            className=" absolute top-2  right-2 bg-gray-100 flex items-center justify-center  rounded-full h-8 w-8 cursor-pointer "
          >
            <HiOutlineXMark className="" size={20} />
          </div>
          <h1 className="text-lg relative font-bold mb-3">
            {isEdit ? "Change Address" : "Add Your Address"}
          </h1>
          {/*button to clear address*/}
          {(status === "success" || status === "denied") && (
            <button
              onClick={() => {
                clearLocation();
                reset({
                  label: "",
                  flat: "",
                  street: "",
                  city: "",
                  pincode: "",
                  state: "",
                });
              }}
              className="text-[13px] absolute top-10  right-5 pb-2 w-fit  cursor-pointer font-medium text-[#1E4ED8] hover:underline flex items-center gap-1"
            >
              <span>Clear</span>
            </button>
          )}
          {/* auto detect location button */}
          <button
            onClick={() => {
              detect();
            }}
            disabled={status == "loading"}
            className={`cursor-pointer w-full py-2 px-3  rounded-lg text-[13px] font-medium transition-all duration-200 flex items-center justify-center gap-2
                        ${status === "idle" ? "bg-white text-gray-700 border border-gray-400 hover:bg-gray-100" : ""}
                        ${status === "loading" ? "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed" : ""}
                        ${status === "denied" ? "bg-red-50 text-red-600 border border-red-200" : ""}
                        ${status === "success" ? "bg-green-50 text-green-600 border border-green-200" : ""}
                      `}
          >
            <FaMapPin className="text-gray-700" />
            {status === "idle" && "Auto-detect my location"}
            {status === "success" && "Location Detected"}
            {status === "loading" && "Detecting..."}
            {status === "denied" && "Permission denied"}
          </button>
          <h2 className="text-base text-center text-blue-600 font-semibold my-3">
            OR
          </h2>
          {/*manual address fill form */}
          <div>
            <div className="relative">
              <label
                htmlFor="label"
                className="block  text-[13px] font-bold mb-1"
              >
                Label (optional)
              </label>
              <input
                {...register("label")}
                id="label"
                type="text"
                placeholder="E.g., Home"
                className="w-full border border-gray-300 rounded-md pl-3 pr-3 py-2 placeholder:text-[13px] text-[13px] text-gray-700 mb-3 focus:outline-none focus:ring-1 focus:ring-blue-400 "
              />
            </div>
            <div className="relative">
              <label
                htmlFor="flat"
                className="block  text-[13px] font-bold mb-1"
              >
                Flat, House No, or Apartment
              </label>
              <input
                {...register("flat")}
                id="flat"
                type="text"
                placeholder="E.g., Diamond Jubilee Girls Hostel"
                className="w-full border border-gray-300 rounded-md pl-3 pr-3 py-2 placeholder:text-[13px] text-[13px] text-gray-700 mb-3 focus:outline-none focus:ring-1 focus:ring-blue-400 "
              />
            </div>
            <div className="relative">
              <label
                htmlFor="street"
                className="block text-[13px] font-bold mb-1"
              >
                Area, Street, Sector, Village
              </label>
              <input
                {...register("street", { required: "This field is required" })}
                id="street"
                type="text"
                placeholder="E.g., MNNIT Allahabad Campus"
                className="w-full border border-gray-300 rounded-md pl-3 pr-3 py-2 placeholder:text-[13px] text-[13px] text-gray-700 mb-3 focus:outline-none focus:ring-1 focus:ring-blue-400  "
              />
              {errors.street && (
                <p className="text-red-500 text-[11px] absolute top-1 right-0">
                  {errors.street.message}
                </p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="city"
                className="block text-[13px] font-bold mb-1"
              >
                Town/City
              </label>
              <input
                {...register("city", { required: "This field is required" })}
                id="city"
                type="text"
                placeholder="E.g., Prayagraj"
                className="w-full border border-gray-300 rounded-md pl-3 pr-3 py-2 placeholder:text-[13px] text-[13px] text-gray-700 mb-3 focus:outline-none focus:ring-1 focus:ring-blue-400  "
              />
              {errors.city && (
                <p className="text-red-500 text-[11px] absolute top-1 right-0">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="state"
                className="block text-[13px] font-bold mb-1"
              >
                State
              </label>
              <input
                {...register("state", { required: "This field is required" })}
                id="state"
                type="text"
                placeholder="E.g., Uttar Pradesh"
                className="w-full border border-gray-300 rounded-md pl-3 pr-3 py-2 placeholder:text-[13px] text-[13px] text-gray mb-3 focus:outline-none focus:ring-1 focus:ring-blue-400  "
              />
              {errors.state && (
                <p className="text-red-500 text-[11px] absolute top-1 right-0">
                  {errors.state.message}
                </p>
              )}
              <div className="relative">
                <label
                  htmlFor="pincode"
                  className="block text-[13px] font-bold mb-1"
                >
                  Pincode
                </label>
                <input
                  {...register("pincode", {
                    required: "This field is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "Pincode must be 6 digits",
                    },
                  })}
                  id="pincode"
                  type="text"
                  placeholder="E.g., 211004"
                  className="w-full border border-gray-300 rounded-md pl-3 pr-3 py-2 placeholder:text-[13px] text-[13px] text-gray mb-3 focus:outline-none focus:ring-1 focus:ring-blue-400  "
                />
                {errors.pincode && (
                  <p className="text-red-500 text-[11px] absolute top-1 right-0">
                    {errors.pincode.message}
                  </p>
                )}
              </div>
            </div>
            {/*submit address button */}
            <button
              disabled={isSaving}
              onClick={handleSubmit(submitAddress)}
              className="mt-4 px-4 bg-blue-600 text-white text-[13px] py-2 cursor-pointer rounded-full hover:bg-blue-700 transition duration-200 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Use this address"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressCard;
