import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

export const useLocalStorage = <Type>(key: string, initialValue?: Type) => {
  const [value, setValue] = useState<Type>(() => {
    if (!key) return initialValue;
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
    } catch (error) {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (val: Type) => {
      if (!key) return;
      try {
        if (typeof window !== "undefined")
          window.localStorage.setItem(key, JSON.stringify(val));
      } catch (error) {
        console.log(error);
      }
    },
    [value, key]
  );

  const syncValue = () => {
    if (!key) return;
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    }
  };

  useEffect(() => {
    if (!key) return;
    setStoredValue(value);
  }, [value, setStoredValue, key]);

  return [value, setValue, syncValue] as [
    Type,
    Dispatch<SetStateAction<Type>>,
    () => void
  ];
};
