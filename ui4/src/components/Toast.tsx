import { flux } from '@fluxio/core/flux';
import { getEntries } from '@fluxio/core/object/getEntries';
import { Dictionary } from '@fluxio/core/types';
import { useFlux } from '../hooks/useFlux';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastState {
  content: string;
  type: ToastType;
}

// Flux pour les toasts (Dictionary avec clé = id du toast)
export const toasts$ = flux<Dictionary<ToastState>>({});

// Helper pour afficher un toast avec une clé optionnelle
export const showToast = (
  content: string,
  type: ToastType = 'success',
  duration = 5000,
  key?: string
) => {
  const toastKey = key || `toast_${Date.now()}_${Math.random()}`;

  toasts$.set({
    ...toasts$.get(),
    [toastKey]: { content, type },
  });

  if (duration > 0) {
    setTimeout(() => {
      hideToast(toastKey);
    }, duration);
  }

  return toastKey;
};

// Helper pour fermer un toast spécifique
export const hideToast = (key: string) => {
  const current = toasts$.get();
  const { [key]: removed, ...rest } = current;
  toasts$.set(rest);
};

const getAlertClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'alert-success';
    case 'error':
      return 'alert-error';
    case 'warning':
      return 'alert-warning';
    case 'info':
      return 'alert-info';
    default:
      return 'alert-info';
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case 'error':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case 'warning':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      );
    case 'info':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="stroke-current shrink-0 w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      );
    default:
      return null;
  }
};

export const Toast = () => {
  const toasts = useFlux(toasts$);
  const toastEntries = getEntries(toasts) as [string, ToastState][];

  if (toastEntries.length === 0) {
    return null;
  }

  return (
    <div class="toast toast-top toast-end z-[100]">
      {toastEntries.map(([key, toast]) => (
        <div key={key} class={`alert ${getAlertClass(toast.type)} shadow-lg`}>
          {getIcon(toast.type)}
          <span>{toast.content}</span>
          <button
            type="button"
            class="btn btn-sm btn-circle btn-ghost"
            onClick={() => hideToast(key)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
