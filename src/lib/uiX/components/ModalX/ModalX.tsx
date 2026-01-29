import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ModalContext } from './modal.context';
import type { ModalXProps, ModalContextValue } from './types';
import './ModalX.css';

export const ModalX: React.FC<ModalXProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  children,
  footer,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  // Determinar el ancho del modal según el tamaño
  const getModalWidth = (): string => {
    const sizeMap: Record<string, string> = {
      sm: '400px',
      md: '600px',
      lg: '800px',
      xl: '1000px',
      full: '95vw',
    };
    
    if (sizeMap[size]) return sizeMap[size];
    
    if (size.includes('x')) {
      const [width] = size.split('x');
      return `${width}px`;
    }
    
    return size;
  };

  // Manejar apertura y cierre con animaciones
  useEffect(() => {
    if (isOpen) {
      // Abrir modal - programar ambos estados de forma asíncrona
      timeoutRef.current = setTimeout(() => {
        setShouldRender(true);
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
          setIsAnimating(true);
        }, 10);
      }, 0) as unknown as number;
    } else {
      // Cerrar modal - primero la animación
      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = '';
        
        // Luego desmontar después de la animación
        setTimeout(() => {
          setShouldRender(false);
        }, 300);
      }, 0) as unknown as number;
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  // Limpiar overflow al desmontar
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Manejar ESC
  useEffect(() => {
    if (!closeOnEsc || !isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // Manejar click en overlay
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnOverlay && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnOverlay, onClose]
  );

  if (!shouldRender) return null;

  const contextValue: ModalContextValue = {
    close: onClose,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      <div 
        className="modal-overlay" 
        onClick={handleOverlayClick} 
        data-visible={isAnimating}
      >
        <div 
          className="modal-container" 
          style={{ width: getModalWidth() }} 
          data-visible={isAnimating}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="modal-header">
              {title && <h2 className="modal-title">{title}</h2>}
              {showCloseButton && (
                <button 
                  className="modal-close-btn" 
                  onClick={onClose} 
                  aria-label="Cerrar"
                >
                  ×
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="modal-body">{children}</div>

          {/* Footer */}
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </ModalContext.Provider>
  );
};