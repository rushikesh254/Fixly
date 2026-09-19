import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "../utils/apiError";

// Small data fetching hook so every page handles the request lifecycle the same
// way: loading while in flight, an error message on failure, and a refetch for
// after a create / update / delete.
//
// `fetcher` must be a stable function ( wrap it in useCallback ) and is expected
// to resolve with the data the page needs.
export function useFetch(fetcher, { enabled = true, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  // ignore the response of a request that was replaced by a newer one
  const requestId = useRef(0);

  const load = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    requestId.current += 1;
    const currentRequest = requestId.current;

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      if (currentRequest === requestId.current) setData(result);
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(getApiErrorMessage(err));
      }
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [fetcher, enabled]);

  useEffect(() => {
    // Fetching on mount is exactly the "synchronise with an external system"
    // case effects exist for, and the request has to flip the loading flag
    // before it starts. There is no data fetching library in the project to
    // hand this off to, so the rule is silenced here only.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // a pending response must not overwrite the state of an unmounted page
    return () => {
      requestId.current += 1;
    };
  }, [load]);

  return { data, loading, error, refetch: load, setData };
}

export default useFetch;
