import { type Root } from 'react-dom/client';
import { type Toast, type ToastPosition } from './types';
import { ToastContainer } from './ToastContainer';
import './toast.css';

export const renderToastContainers = (root: Root, toasts: Toast[], onRemove: (id: string) => void) => {
  const positions: ToastPosition[] = [
    'top-left', 'top-center', 'top-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ];

  root.render(
    <>
      {positions.map(pos => (
        <ToastContainer 
          key={pos} 
          position={pos} 
          toasts={toasts}
          onRemove={onRemove}
        />
      ))}
    </>
  );
};
