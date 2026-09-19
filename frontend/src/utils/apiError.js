// Single place that turns an axios failure into a message worth showing. Keeps
// the wording consistent and never surfaces a raw stack trace to the user.
const getApiErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again.",
) => {
  if (!error) return fallback;

  const message = error.response?.data?.message;
  if (message) return message;

  if (error.response?.status === 401) {
    return "Your session has expired. Please log in again.";
  }
  if (error.response?.status === 403) {
    return "You are not allowed to do that.";
  }
  if (error.response?.status === 404) {
    return "We could not find what you were looking for.";
  }
  if (error.response?.status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }
  // no response at all means the request never reached the server
  if (error.request && !error.response) {
    return "Cannot reach the server. Check your connection and try again.";
  }

  return fallback;
};

export default getApiErrorMessage;
export { getApiErrorMessage };
