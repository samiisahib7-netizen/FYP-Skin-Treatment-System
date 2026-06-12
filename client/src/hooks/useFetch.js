import { useCallback, useEffect, useState } from 'react';

/**
 * Simple data-fetch hook with loading + error states.
 */
export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return Promise.resolve(fetcher())
      .then(setData)
      .catch((e) => setError(e?.response?.data?.message || e.message || 'Request failed'))
      .finally(() => setLoading(false));
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}
