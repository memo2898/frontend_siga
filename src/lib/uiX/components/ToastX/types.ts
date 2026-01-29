export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
}

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
  position: ToastPosition;
}