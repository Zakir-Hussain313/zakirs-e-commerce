import axios, { AxiosRequestConfig, Method } from "axios";
import { useEffect, useMemo, useState } from "react";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useFetch = <T = any>(
  url: string | null,
  method: Method = "GET",
  options: AxiosRequestConfig = {}
): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const optionsString = JSON.stringify(options);

  const requestOptions = useMemo(() => {
    const opts: AxiosRequestConfig = { ...options };
    if (method === "POST" && !opts.data) {
      opts.data = {};
    }
    return opts;
  }, [method, optionsString]);

  useEffect(() => {
    if (!url) return; // ✅ prevent invalid API calls

    const apiCall = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: response } = await axios({
          url,
          method,
          ...requestOptions,
        });

        if (response.success === false) {
          throw new Error(response.message || "API call failed");
        }

        setData(response);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    apiCall();
  }, [url, requestOptions, refreshIndex, method]);

  const refetch = () => {
    setRefreshIndex((prev) => prev + 1);
  };

  return { data, loading, error, refetch };
};

export default useFetch;
