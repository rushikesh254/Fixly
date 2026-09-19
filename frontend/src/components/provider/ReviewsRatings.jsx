import { FaStar } from "react-icons/fa";
import formatDate from "../../utils/formatDate";

function ReviewsRatings({ provider }) {
  const { reviews = [], rating = 0, totalReviews = 0 } = provider || {};

  return (
    <div>
      {/* Average rating summary */}
      <div className="mb-8 flex items-center gap-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900">{rating}</p>
          <div className="mt-1 flex items-center justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                size={16}
                className={
                  i < Math.round(rating)
                    ? "text-amber-400 fill-current"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
        </div>
        <div className="h-10 w-px bg-slate-200" />
        <div>
          <p className="text-sm font-medium text-gray-900">
            {totalReviews} total reviews
          </p>
          <p className="mt-0.5 text-[13px] text-gray-500">
            Based on customer feedback
          </p>
        </div>
      </div>

      {/* Reviews list */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          Reviews ({reviews.length})
        </h3>

        {reviews.length > 0 ? (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                    {review.user[0]}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {review.user}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            size={12}
                            className={
                              i < review.rating
                                ? "text-amber-400 fill-current"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-[12px] text-gray-400">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-600">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default ReviewsRatings;
