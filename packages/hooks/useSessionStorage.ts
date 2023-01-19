import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

export const useSessionStorage = <Type>(key: string, initialValue?: Type) => {
  const [value, setValue] = useState<Type>(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.sessionStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
    } catch (error) {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (val: Type) => {
      try {
        if (typeof window !== "undefined")
          window.sessionStorage.setItem(key, JSON.stringify(val));
      } catch (error) {
        console.log(error);
      }
    },
    [value, key]
  );

  const syncValue = () => {
    if (typeof window !== "undefined") {
      const item = window.sessionStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    }
  };

  useEffect(() => {
    setStoredValue(value);
  }, [value, setStoredValue]);

  return [value, setValue, syncValue] as [
    Type,
    Dispatch<SetStateAction<Type>>,
    () => void
  ];
};
