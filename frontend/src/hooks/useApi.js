import { useState, useCallback } from "react";

/**
 * useApi — wraps any async API call with loading / error / data state.
 *
 * Usage:
 *   const { data, loading, error, execute } = useApi(bookingAPI.getMy);
 *   useEffect(() => { execute(); }, []);
 */
const useApi = (apiFn, immediate = false) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error,   setError]   = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      setData(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  return { data, loading, error, execute, setData };
};

export default useApi;
