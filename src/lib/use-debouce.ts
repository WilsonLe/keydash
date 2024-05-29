import { useCallback, useEffect, useRef } from "react";

type CallbackFunction = (...args: any[]) => void;

function useDebounce<T extends CallbackFunction>(callback: T, delay: number) {
  const handlerRef = useRef<ReturnType<typeof setTimeout>>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (handlerRef.current) {
        clearTimeout(handlerRef.current);
      }

      handlerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  useEffect(() => {
    return () => {
      if (handlerRef.current) {
        clearTimeout(handlerRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

export default useDebounce;
