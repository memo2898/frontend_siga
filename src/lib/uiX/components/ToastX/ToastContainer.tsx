import React from 'react';
import { type Toast, type ToastPosition } from './types';
import { ToastX } from './ToastX';

interface ToastContainerProps {
  position: ToastPosition;
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ position, toasts, onRemove }) => {
  const positionedToasts = toasts.filter(t => t.position === position);
  const visibleToasts = positionedToasts.slice(0, 5);

  if (visibleToasts.length === 0) return null;

  return (
    <div className={`toast-container toast-container-${position}`}>
      {visibleToasts.map((toast, index) => (
        <ToastX
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
          index={index}
        />
      ))}
    </div>
  );
};