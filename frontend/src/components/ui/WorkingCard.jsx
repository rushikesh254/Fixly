function WorkingCard({ icon, title, description, step }) {
  return (
    <div className="group relative bg-[#0F2F66] rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300 p-6 text-center w-64">
      {step && (
        <span className="absolute top-3 left-4 text-blue-600 text-xs font-bold">
          {step}
        </span>
      )}

      <div className="flex items-center justify-center mb-4">
        <div className="bg-blue-100 p-4 rounded-full transition duration-300 ">
          <div className="text-[#1E4ED8] transition duration-300 group-hover:scale-110">
            {icon}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-50 mb-2">{title}</h3>
      <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

export default WorkingCard;
