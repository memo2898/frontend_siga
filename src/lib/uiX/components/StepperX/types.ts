import type { ReactNode } from 'react';

export interface StepDefinition {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  optional?: boolean;
  /** Determina si el paso debe mostrarse */
  condition?: () => boolean;
}

export type StepStatus = 'pending' | 'current' | 'completed' | 'error';

export interface StepperXProps {
  /** Definicion de los pasos */
  steps: StepDefinition[];
  /** Indice del paso actual (0-based). Si no se proporciona, el stepper maneja su propio estado */
  currentStep?: number;
  /** Callback cuando cambia el paso */
  onStepChange?: (stepIndex: number) => void;
  /** Permite navegacion libre o solo secuencial */
  allowFreeNavigation?: boolean;
  /** Funcion que valida si puede avanzar al siguiente paso */
  canProceed?: (currentStep: number) => boolean | Promise<boolean>;
  /** Orientacion del stepper */
  orientation?: 'horizontal' | 'vertical';
  /** Tamanio */
  size?: 'sm' | 'md' | 'lg';
  /** Contenido de cada paso */
  children: ReactNode;
  /** Clase CSS adicional */
  className?: string;
  /** Mostrar botones de navegacion */
  showNavigation?: boolean;
  /** Texto del boton anterior */
  prevLabel?: string;
  /** Texto del boton siguiente */
  nextLabel?: string;
  /** Texto del boton finalizar (ultimo paso) */
  finishLabel?: string;
  /** Callback al finalizar */
  onFinish?: () => void | Promise<void>;
  /** Estado de carga */
  isLoading?: boolean;
}

export interface StepperXRef {
  /** Avanzar al siguiente paso */
  next: () => Promise<boolean>;
  /** Retroceder al paso anterior */
  prev: () => void;
  /** Ir a un paso especifico */
  goTo: (step: number) => Promise<boolean>;
  /** Obtener paso actual */
  getCurrentStep: () => number;
  /** Reiniciar al primer paso */
  reset: () => void;
}

export interface StepperContextValue {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  next: () => Promise<boolean>;
  prev: () => void;
  goTo: (step: number) => Promise<boolean>;
  canProceed: boolean;
  setCanProceed: (value: boolean) => void;
  isLoading: boolean;
}
