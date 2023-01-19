import { useEffect } from "react";

export const useClickAway = (
  ref: React.RefObject<any>,
  onClickAway: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      onClickAway();
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, onClickAway]);
};
