import { FaStar } from "react-icons/fa";

function reviewSection({ reviews }) {
  return (
    <>
      {" "}
      <div className="py-5">
        <h1 className="text-lg font-bold tracking-wide">
          {reviews.length > 0
            ? `CUSTOMER REVIEWS (${reviews.length})`
            : "CUSTOMER REVIEWS"}
        </h1>
        {reviews.length > 0 ? (
          <div className="mt-4 space-y-4 border-b border-gray-300 pt-4">
            {reviews.map((review, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center gap-3 ">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                    {review.user[0]}
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                      {review.user}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <FaStar
                          key={index}
                          className={`w-4 h-4 ${
                            index < review.rating
                              ? "text-amber-500 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm font-medium text-gray-500">
            No reviews yet.Book and be the first to share your experience!
          </p>
        )}
      </div>
    </>
  );
}

export default reviewSection;
