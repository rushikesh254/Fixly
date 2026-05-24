function WorkingCard({ icon, title, description, step }) {
  return (
    <div
      className="
        group relative w-full max-w-sm overflow-hidden
        rounded-2xl border border-blue-100/70
        bg-white/90 backdrop-blur-sm
        shadow-md hover:shadow-2xl
        hover:-translate-y-1
        transition-all duration-300
        p-6 text-center
      "
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#1E4ED8] to-blue-400" />

      {step && (
        <div className="absolute top-4 left-4">
          <span
            className="
              flex items-center justify-center
              w-7 h-7 rounded-full
              bg-blue-50 border border-blue-100
              text-[#1E4ED8] text-sm font-semibold
            "
          >
            {step}
          </span>
        </div>
      )}

      <div className="flex items-center justify-center mb-5 mt-3">
        <div
          className="
            bg-linear-to-br from-blue-50 to-blue-100
            p-5 rounded-2xl
            shadow-sm
            group-hover:scale-105
            group-hover:bg-blue-600
            transition-all duration-300
          "
        >
          <div
            className="
              text-[#1E4ED8]
              transition-all duration-300
            "
          >
            {icon}
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-[#163BA3] mb-2 tracking-tight">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-slate-500">{description}</p>

      <div
        className="
          absolute inset-0 rounded-2xl
          ring-1 ring-transparent
          group-hover:ring-blue-200
          transition duration-300
          pointer-events-none
        "
      />
    </div>
  );
}

export default WorkingCard;
