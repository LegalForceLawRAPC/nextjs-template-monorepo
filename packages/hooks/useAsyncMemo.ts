import {
  DependencyList,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useAsyncEffect } from "./useAsyncEffect";

export interface AsyncMemoProps<T, D = T> {
  set: Dispatch<SetStateAction<T | D>>;
  refresh: () => Promise<void>;
  loading: boolean;
  fetch: () => Promise<void>;
}

export const useAsyncMemo = <T, D = null>(
  fetcher: (prev: T | D, o: { loading: boolean }) => Promise<T | D> | T | D,
  deps: DependencyList = [],
  { defaultValue, storeLocal }: { storeLocal?: string; defaultValue?: D } = {}
): [T | D, AsyncMemoProps<T, D>] => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<T | D>(() => {
    if (storeLocal) {
      try {
        if (typeof window !== "undefined") {
          const item = window.localStorage.getItem(storeLocal);
          return item ? JSON.parse(item) : defaultValue;
        }
        return defaultValue;
      } catch (error) {
        return defaultValue;
      }
    } else {
      return defaultValue;
    }
  });

  const getValue = async () => {
    setLoading(true);
    setValue(await fetcher(value, { loading }));
    setLoading(false);
  };

  useAsyncEffect(getValue, deps);

  useEffect(() => {
    if (!storeLocal) return;
    try {
      if (typeof window !== "undefined")
        window.localStorage.setItem(storeLocal, JSON.stringify(value));
    } catch (error) {
      ///
    }
  }, [value, storeLocal]);

  return [
    value,
    {
      refresh: getValue,
      set: setValue,
      loading,
      fetch: async () => setValue(await fetcher(value, { loading })),
    },
  ];
};
