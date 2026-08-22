import { useState } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { toast } from "sonner";

function SaveBtn() {
  const [saved, setSaved] = useState(false);

  const handleBookmarkClick = () => {
    setSaved(!saved);
    if (!saved) {
      toast.success("Service saved to your list!");
    } else {
      toast.error("Service removed from your saved list.");
    }
  };

  return (
    <div
      onClick={handleBookmarkClick}
      className="absolute h-9 w-9 z-10 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 shadow-md right-3 top-3 cursor-pointer flex items-center justify-center text-gray-200 hover:text-white hover:bg-gray-800/70 transition-all duration-200 group/btn"
    >
      {saved ? (
        <FaBookmark className="text-gray-300 scale-110" />
      ) : (
        <FaRegBookmark className="text-gray-200" />
      )}
      <span className="absolute top-11 right-0 w-max bg-gray-800 text-gray-100 font-medium text-xs px-3 py-1.5 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg z-20 border border-gray-600">
        Save for later
      </span>
    </div>
  );
}

export default SaveBtn;
