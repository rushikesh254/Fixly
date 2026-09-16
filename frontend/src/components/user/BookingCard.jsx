import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { HiOutlineXMark } from "react-icons/hi2";
import availableSlots from "../../constants/availableSlots";
import PrimaryBtn from "../ui/PrimaryBtn";
import AddressCard from "./AddressCard";
import ConfirmModal from "./ConfirmModal";

//  get saved address from localStorage
function getSavedAddress() {
  try {
    return JSON.parse(localStorage.getItem("userAddress")) || {};
  } catch {
    return {};
  }
}

// Set date limits
const today = new Date();
const maxDate = new Date(today);
maxDate.setDate(today.getDate() + 6); // Set max date to 6 days from today

function BookingCard({ service, setOpenBooking }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const { providerName, title, distance, location } = service;
  const [formData, setFormData] = useState(null);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const savedAddress = getSavedAddress();
  const addressText = [
    savedAddress.flat,
    savedAddress.street,
    savedAddress.city,
    savedAddress.state,
    savedAddress.pincode,
  ]
    .filter(Boolean)
    .join(", ");
  // Update the "where" field whenever the address changes
  useEffect(() => {
    setValue("where", addressText || "No address added", {
      shouldValidate: true,
    });
  }, [addressText, setValue]);

  return (
    <div>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white relative rounded-lg py-5 px-6 w-full max-w-md mx-4">
          <div
            onClick={() => setOpenBooking(false)}
            className=" absolute   right-2 top-2 bg-gray-100 flex items-center justify-center  rounded-full h-8 w-8 cursor-pointer "
          >
            <HiOutlineXMark className="" size={20} />
          </div>
          <div className="">
            <h1 className=" text-2xl font-bold ">{title}</h1>

            <h2 className="mb-4 flex items-center text-base  font-semibold">
              <span className="font-semibold text-blue-600">
                {providerName}
              </span>

              <span className="px-2 text-gray-700">|</span>

              <FiMapPin className="mr-1 text-gray-700" size={16} />

              <span className="text-sm font-normal text-gray-700">
                {location}

                {distance ? ` • ${distance.toFixed(0)} km away` : ""}
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {/* Address Section  */}
            <div className="space-y-2 relative">
              <label
                htmlFor="where"
                className="text-sm text-gray-800 font-semibold "
              >
                Where do you need the service?
              </label>
              <div className="relative">
                <input
                  {...register("where", {
                    required: "Address is required",
                    validate: (value) =>
                      value !== "No address added" || "Address is required",
                  })}
                  id="where"
                  type="text"
                  defaultValue={addressText || "No address added"}
                  readOnly
                  className="text-[13px] border px-3 mt-1 py-2 rounded-lg outline-none w-full text-gray-800 bg-gray-50 border-gray-300"
                />
              </div>
              {errors.where && (
                <p className=" absolute top-2 right-1 text-red-600 text-[13px] -mt-1">
                  {errors.where.message}
                </p>
              )}

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setAddressOpen(true)}
                  className="cursor-pointer bg-transparent p-0 text-[13px] font-semibold text-blue-600 hover:underline"
                >
                  {addressText ? "Change Address" : "Add Address"}
                </button>
              </div>

              {addressOpen && (
                <AddressCard
                  addressOpen={addressOpen}
                  setAddressOpen={setAddressOpen}
                />
              )}
            </div>
            {/* Date Picker Section * */}
            <div className="relative">
              <label
                htmlFor="date"
                className="text-sm text-gray-800 font-semibold"
              >
                When do you need the service?
              </label>
              <div className="relative w-full flex items-center mt-1 ">
                <FiCalendar
                  className="absolute z-10  right-3 text-gray-400"
                  size={16}
                />
                <DatePicker
                  {...register("date", { required: "Date is required" })}
                  id="date"
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setValue("date", date, { shouldValidate: true });
                  }}
                  minDate={today}
                  maxDate={maxDate}
                  placeholderText="Select date"
                  wrapperClassName="w-full"
                  className="text-[13px]  border px-3 py-2 rounded-lg outline-none w-full text-gray-800 bg-gray-50 border-gray-300"
                />
              </div>
              {errors.date && (
                <p className="absolute right-1 top-2 text-red-600 text-[13px] -mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>
            {/*Slot selection section  */}
            <div className="space-y-2 relative">
              <label
                htmlFor="time"
                className="text-sm text-gray-800 font-semibold"
              >
                What time do you need the service?
              </label>
              <input
                type="hidden"
                {...register("time", { required: "Time is required" })}
              />
              <div
                id="time"
                className="grid grid-cols-5 gap-3 mt-3 text-xs text-gray-700"
              >
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      const newSlot = selectedSlot === slot ? "" : slot;
                      setSelectedSlot(newSlot);
                      setValue("time", newSlot, { shouldValidate: true });
                    }}
                    className={`border rounded-lg py-1 cursor-pointer 
                      ${selectedSlot === slot ? "border-2 border-[#1E4ED8] text-[#1E4ED8] font-semibold" : "bg-white text-gray-700 border-gray-300 hover:border-[#1E4ED8] hover:text-[#1E4ED8]"}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {errors.time && (
                <p className="absolute top-2 right-1 text-red-600 text-[13px] -mt-1">
                  {errors.time.message}
                </p>
              )}
            </div>
            {/*Additional instructions section  */}
            <div>
              <label
                htmlFor="additional"
                className="text-sm text-gray-800 font-semibold"
              >
                Additional Details (optional)
              </label>
              <textarea
                {...register("additional")}
                id="additional"
                rows={3}
                className="text-[13px] border px-3 py-2 rounded-lg outline-none w-full text-gray-800 bg-gray-50 border-gray-300 mt-1 "
                placeholder="Describe the issue, special instructions, access details, or anything else the provider should know."
              />
            </div>
            {/*Confirmation button  */}
            <PrimaryBtn
              btn="Continue "
              onclick={handleSubmit((data) => {
                setFormData(data);
                setConfirmModalOpen(true);
              })}
            />
          </div>
        </div>
      </div>
      {confirmModalOpen && (
        <ConfirmModal
          setConfirmModalOpen={setConfirmModalOpen}
          service={service}
          formData={formData}
          setOpenBooking={setOpenBooking}
        />
      )}
    </div>
  );
}

export default BookingCard;
