import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";
import PrimaryBtn from "../ui/PrimaryBtn";

function ReviewModal({ setShowReviewModal, providerName }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    toast.success("Review submitted successfully!");
    setShowReviewModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-slate-900">
            Rate Your Experience
          </h2>
          <button
            onClick={() => setShowReviewModal(false)}
            className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RxCross1 size={18} />
          </button>
        </div>

        {/* Provider Name */}
        <p className="text-[13px] text-slate-500 mb-5">
          How was your experience with{" "}
          <span className="font-medium text-blue-600">{providerName}</span>?
        </p>

        {/* Star Rating */}
        <div className="flex items-center gap-1.5 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="cursor-pointer transition-transform active:scale-110"
            >
              <FaStar
                size={30}
                className={`transition-colors duration-200 ${
                  star <= rating ? "text-amber-400" : "text-slate-200"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm font-medium text-slate-600">
              {rating}/5
            </span>
          )}
        </div>

        {/* Review Text */}
        <div className="mb-6">
          <label className="block text-[13px] font-medium text-slate-700 mb-2">
            Your Review{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share details about your experience..."
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none transition"
          />{" "}
        </div>

        {/* Button */}
        <div className="flex justify-end gap-3">
          <PrimaryBtn btn="Submit" onclick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
