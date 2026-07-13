import { useEffect, useState } from 'preact/hooks';
import type { RefObject } from 'preact';

type RefOrElement<T extends Element> = RefObject<T> | T | null | undefined;

const getElement = <T extends Element>(refOrElement?: RefOrElement<T>): T | null => {
  if (!refOrElement) return null;
  if (refOrElement instanceof Element) return refOrElement as T;
  return (refOrElement as RefObject<T>).current || null;
};

/**
 * Hook to detect when an element becomes visible in the viewport using IntersectionObserver.
 *
 * @param ref - The element or ref to observe
 * @param root - The scrollable container element or ref (default: viewport)
 * @param threshold - Visibility threshold:
 *   - 0-1: percentage of element visible (0 = any pixel, 1 = fully visible)
 *   - >1: margin in pixels around the root before triggering
 * @returns true when the element becomes visible
 *
 * @example
 * const imgRef = useRef<HTMLImageElement>(null);
 * const isVisible = useIsVisible(imgRef, undefined, 50); // Trigger 50px before entering viewport
 */
export const useIsVisible = <T extends Element>(
  ref?: RefOrElement<T>,
  root?: RefOrElement<Element>,
  threshold: number = 0
): boolean => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = getElement(ref);
    if (!element) return;

    const rootElement = getElement(root);
    const options: IntersectionObserverInit = {
      root: rootElement,
    };

    if (threshold > 1) {
      // threshold > 1 = margin in px
      options.rootMargin = `${threshold}px`;
      options.threshold = 0;
    } else {
      // threshold 0-1 = percentage
      options.threshold = threshold;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, root, threshold]);

  return isVisible;
};
