import { useCallback, useEffect, useState } from "react";

const useLocalStorage = (key, defaultValue = {}) => {
  const [value, setState] = useState(defaultValue);

  useEffect(() => {
    const store = localStorage.getItem(key);
    if (store !== null) {
      try {
        setState(JSON.parse(store));
      } catch (err) {
        localStorage.removeItem(key);
      }
    }
  }, [key]);

  const setValue = useCallback(
    (newValue) => {
      setState(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    [key]
  );

  return [value, setValue];
};
export default useLocalStorage;
