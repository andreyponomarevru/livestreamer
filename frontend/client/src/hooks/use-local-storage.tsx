import React from "react";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  function getSavedValue(key: string, defaultValue: T): T {
    const saved = localStorage.getItem(key);

    try {
      return saved !== null ? JSON.parse(saved) : defaultValue;
    } catch (err) {
      console.error("Error retrieving items from Local Storage", err);
      return defaultValue;
    }
  }

  const [value, setValue] = React.useState<T>(() =>
    getSavedValue(key, defaultValue)
  );

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
