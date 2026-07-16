import { useCallback, useEffect, useState } from "react";

/** Fetch-on-mount with error + retry, shared by both dashboard tabs */
export function useAsyncData<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    loader()
      .then(setData)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load data")
      );
  }, [loader]);

  useEffect(load, [load]);

  return { data, error, retry: load };
}
