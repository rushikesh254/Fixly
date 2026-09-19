// Shared loading and error placeholders. They reuse the card styling of
// EmptyState so a page looks the same whether it is loading, empty or broken.

function Loader({ label = "Loading...", className = "" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center ${className}`}
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry, className = "" }) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-red-200 bg-red-50/40 py-16 text-center ${className}`}
    >
      <p className="font-semibold text-red-700">Something went wrong</p>
      <p className="max-w-xs text-sm text-red-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 cursor-pointer rounded-xl border border-red-200 bg-white px-6 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// Inline variant for small regions such as a sidebar column
export function InlineLoader({ label = "Loading...", className = "" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center gap-3 py-8 text-sm text-gray-500 ${className}`}
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
      {label}
    </div>
  );
}

export default Loader;
