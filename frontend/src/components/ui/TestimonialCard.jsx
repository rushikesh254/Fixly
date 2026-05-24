import { FaStar, FaUserCircle } from "react-icons/fa";

function TestimonialCard({ testimonial }) {
  const { name, role, content, review } = testimonial;
  return (
    <div className="bg-[#0F2F66] min-h-44 w-full  flex flex-col justify-between rounded-lg p-5 text-gray-300 shadow-lg hover:scale-05 hover:scale-105 transition-transform duration-500">
      <div className="text-[13px] mb-3">{content}</div>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-500 mr-3 flex items-center justify-center overflow-hidden">
            <FaUserCircle className="object-cover text-gray-300 size-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-300">{name}</h3>
            <p className="text-[13px] text-gray-500">{role} </p>
          </div>
        </div>
        <div className="flex items-center border-gray-300 border rounded-full px-1.5 py-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <FaStar
              key={index}
              className={`w-4 h-4  ${index < review ? "text-amber-400 fill-current" : "text-gray-400"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
