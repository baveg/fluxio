export const onTimeout = (callback: () => void, delay?: number) => {
  const timeout = setTimeout(callback, delay);
  return () => clearTimeout(timeout);
}