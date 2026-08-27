import { FiArrowLeft, FiCheckCircle, FiPhone, FiXCircle } from "react-icons/fi";

const statusStyles = {
  Completed: {
    badge: "bg-green-100 text-green-700",
    banner: "bg-green-50 border-green-200",
    iconWrap: "bg-green-100 text-green-600",
    title: "text-green-700",
    bar: "bg-blue-600",
  },
  Cancelled: {
    badge: "bg-gray-100 text-gray-500",
    banner: "bg-gray-50 border-gray-200",
    iconWrap: "bg-gray-100 text-gray-500",
    title: "text-gray-700",
    bar: "bg-blue-600",
  },
  Rejected: {
    badge: "bg-red-100 text-red-600",
    banner: "bg-red-50 border-red-200",
    iconWrap: "bg-red-100 text-red-600",
    title: "text-red-700",
    bar: "bg-blue-600",
  },
};

function HistoryDetailModal({ booking, onClose }) {
  const {
    id,
    customerName,
    customerPhone,
    customerEmail,
    serviceTitle,
    date,
    time,
    address,
    price,
    status,
    specialInstructions,
  } = booking;

  const styles = statusStyles[status] || statusStyles.Completed;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {customerName}
              </h2>
              <p className="text-xs text-slate-500">{serviceTitle}</p>
            </div>
          </div>
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${styles.badge}`}
          >
            {status}
          </span>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Status Banner */}
          <div className={`px-5 py-3 border ${styles.banner}`}>
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm ${styles.iconWrap}`}
              >
                {status === "Completed" ? <FiCheckCircle /> : <FiXCircle />}
              </div>
              <div>
                <p
                  className={`text-[12px] font-semibold ${styles.title}`}
                >{`${status} Booking`}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {status === "Completed"
                    ? `${customerName}'s service was completed on ${formatDate(date)} at ${time}.`
                    : status === "Cancelled"
                      ? `This booking was cancelled by the customer.`
                      : `This booking was rejected.`}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span
                className={`w-1 h-5 rounded-full inline-block ${styles.bar}`}
              ></span>
              CUSTOMER DETAILS
            </h2>
            <div className="space-y-2.5 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Name</span>
                <span className="font-medium text-slate-800">
                  {customerName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email</span>
                <span className="flex items-center gap-2">
                  <span className="font-medium text-slate-800">
                    {customerEmail}
                  </span>
                </span>
              </div>
              {status === "Confirmed" && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Phone Number</span>
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">
                      {customerPhone}
                    </span>
                    <a
                      href={`tel:${customerPhone.replace(/\s/g, "")}`}
                      aria-label={`Call ${customerName}`}
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 active:scale-90"
                    >
                      <FiPhone size={13} />
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Service Address */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span
                className={`w-1 h-5 rounded-full inline-block ${styles.bar}`}
              ></span>
              SERVICE ADDRESS
            </h2>
            <p className="text-[12px] text-slate-700">{address}</p>
          </div>

          {/* Service Details */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span
                className={`w-1 h-5 rounded-full inline-block ${styles.bar}`}
              ></span>
              SERVICE DETAILS
            </h2>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Booking ID</span>
                <span className="font-medium text-slate-800">{id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Service</span>
                <span className="font-medium text-slate-800">
                  {serviceTitle}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Price</span>
                <span className="font-medium text-slate-800">₹ {price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-medium text-slate-800">
                  {formatDate(date)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Time</span>
                <span className="font-medium text-slate-800">{time}</span>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="px-5 py-4">
            <h2 className="font-semibold text-[13px] flex items-center gap-2 mb-3">
              <span
                className={`w-1 h-5 rounded-full inline-block ${styles.bar}`}
              ></span>
              SPECIAL INSTRUCTIONS
            </h2>
            <p className="text-[12px] text-slate-700">
              {specialInstructions || "No special instructions."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryDetailModal;
