import { toError } from "@fluxio/core/cast/toError";
import { flux } from "@fluxio/core/flux/Flux";
import { logger } from "@fluxio/core/logger/Logger";
import { useFlux } from "../hooks/useFlux";

const log = logger('error');

export interface ErrorInfo {
  title: string;
  message: string;
}

export const toastError$ = flux<ErrorInfo | null>(null);

let timeoutId: any;

export const hideToastError = () => {
  clearTimeout(timeoutId);
  toastError$.set(null);
};

export const showToastError = (title: string, error?: any, duration = 3000) => {
  const message = error ? toError(error).message : '';
  log.e(title, error);
  clearTimeout(timeoutId);
  toastError$.set({ title, message });
  if (duration > 0) {
    timeoutId = setTimeout(() => toastError$.set(null), duration);
  }
};

export const ErrorToast = () => {
  const error = useFlux(toastError$);
  if (!error) return null;
  return (
    <div
      class="fixed bottom-4 right-4 z-50 max-w-sm cursor-pointer rounded-lg bg-error text-error-content shadow-lg p-4"
      onClick={hideToastError}
    >
      <div class="font-bold">{error.title}</div>
      {error.message && <div class="text-sm opacity-90 mt-1">{error.message}</div>}
    </div>
  );
};
