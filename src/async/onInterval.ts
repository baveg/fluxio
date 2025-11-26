export const onInterval = (callback: () => void, delay?: number) => {
  const interval = setInterval(callback, delay);
  return () => clearInterval(interval);
}