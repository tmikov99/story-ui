export const getLocalData = <T>(key: string): T | null => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const setLocalData = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalData = (key: string) => {
  localStorage.removeItem(key);
};