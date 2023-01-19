import { useState, useRef, useEffect } from "react";

export const useDeferredValue = <T>(value: T, timeoutMs = 200): T => {
  const [deferredValue, setDeferredValue] = useState(value);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeout.current !== null) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setDeferredValue(value), timeoutMs);
  }, [value, timeoutMs]);

  return deferredValue;
};
