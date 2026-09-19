import { useNavigate } from "react-router-dom";
function EmptyState({ title, description, buttonText, buttonLink, className }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No results"
          className="w-24 opacity-50"
        />
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 max-w-xs">{description}</p>
        {/* only render the action when there is somewhere to send the user */}
        {buttonText && buttonLink && (
          <button
            className={`mt-2 px-6 py-2.5  text-white cursor-pointer text-sm font-medium rounded-xl transition ${className}`}
            onClick={() => navigate(`/${buttonLink}`)}
          >
            {buttonText}
          </button>
        )}
      </div>
    </>
  );
}

export default EmptyState;
