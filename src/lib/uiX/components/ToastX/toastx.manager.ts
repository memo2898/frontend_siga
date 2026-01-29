import { createRoot, type Root } from 'react-dom/client';
import { type Toast, type ToastType, type ToastOptions } from './types';
import { renderToastContainers } from './ToastRenderer';

class ToastManager {
  private toasts: Map<string, Toast> = new Map();
  private root: Root | null = null;
  private container: HTMLDivElement | null = null;

  private ensureContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toastx-root';
      document.body.appendChild(this.container);
      this.root = createRoot(this.container);
    }
  }

  private render() {
    this.ensureContainer();
    if (this.root) {
      const toastArray = Array.from(this.toasts.values());
      renderToastContainers(this.root, toastArray, (id) => this.remove(id));
    }
  }

  add(type: ToastType, message: string, options?: ToastOptions) {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = {
      id,
      type,
      message,
      duration: options?.duration ?? 1000,
      position: options?.position ?? 'bottom-right'
    };

    this.toasts.set(id, toast);
    this.render();

    return id;
  }

  remove(id: string) {
    this.toasts.delete(id);
    this.render();
  }

  clear() {
    this.toasts.clear();
    this.render();
  }
}

// Singleton instance
export const toastManager = new ToastManager();