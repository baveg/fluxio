import { timeoutError } from '../error/TimeoutError';
import { onEventOnce } from './onEvent';

export const waitScriptLoaded = (el: HTMLScriptElement): Promise<HTMLScriptElement> => {
  return (
    (el as any)._loaded ||
    ((el as any)._loaded = new Promise<HTMLScriptElement>((resolve, reject) => {
      const state = (el as any).readyState;
      if (state === 'complete' || state === 'loaded') {
        resolve(el);
        return;
      }

      const timer = setTimeout(() => reject(timeoutError(el.src)), 60000);

      onEventOnce(el, 'load', () => {
        clearTimeout(timer);
        resolve(el);
      });

      onEventOnce(el, 'error', (err) => {
        clearTimeout(timer);
        reject(err);
      });
    }))
  );
};
