import { createContext, useContext } from 'react';
import type { ModalContextValue } from './types';

export const ModalContext = createContext<ModalContextValue | null>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext debe usarse dentro de un ModalX');
  }
  return context;
};