import { onEvent } from './onEvent';

export const autoScrollEnd = (el?: HTMLElement | null) => {
  if (!el) return;
  let lastUserScroll = 0;
  let isAutoScrolling = false;

  const timer = setInterval(() => {
    const isUserScroll = lastUserScroll + 5000 > Date.now();
    const scrollTopMax = el.scrollHeight - el.clientHeight;
    const isAtBottom = Math.abs(el.scrollTop - scrollTopMax) < 2;
    if (isUserScroll || isAtBottom) {
      isAutoScrolling = false;
      return;
    }
    isAutoScrolling = true;
    el.scrollTop = scrollTopMax;
    el.scrollLeft = 0;
  }, 200);

  const off = onEvent(el, 'scroll', () => {
    if (isAutoScrolling) return;
    const scrollTopMax = el.scrollHeight - el.clientHeight;
    const isAtBottom = Math.abs(el.scrollTop - scrollTopMax) < 5;
    lastUserScroll = isAtBottom ? 0 : Date.now();
  });

  return () => {
    clearInterval(timer);
    off();
  };
};
