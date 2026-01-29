export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;

export interface ModalXProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  closeOnOverlay?: boolean;  // default: true
  closeOnEsc?: boolean;      // default: true
  showCloseButton?: boolean; // default: true
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export interface ModalContextValue {
  close: () => void;
}