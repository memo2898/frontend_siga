import { toastManager } from './toastx.manager';
import { type ToastOptions } from './types';

export const toastx = {
  success: (message: string, options?: ToastOptions) => {
    return toastManager.add('success', message, options);
  },
  error: (message: string, options?: ToastOptions) => {
    return toastManager.add('error', message, options);
  },
  warning: (message: string, options?: ToastOptions) => {
    return toastManager.add('warning', message, options);
  },
  info: (message: string, options?: ToastOptions) => {
    return toastManager.add('info', message, options);
  },
  clear: () => {
    toastManager.clear();
  }
};

export type { ToastOptions, ToastType, ToastPosition } from './types';