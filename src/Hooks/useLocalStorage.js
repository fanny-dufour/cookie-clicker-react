import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  const data = localStorage.getItem(key);
  const initial = data ? JSON.parse(data) : initialValue;
  const [value, setValue] = useState(initial);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
};

export default useLocalStorage;
