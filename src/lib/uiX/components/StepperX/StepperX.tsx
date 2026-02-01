import {
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
  useCallback,
  createContext,
  useContext,
  Children,
  isValidElement,
  cloneElement,
} from 'react';
import type { ReactElement } from 'react';
import type { StepperXProps, StepperXRef, StepperContextValue, StepStatus } from './types';
import './StepperX.css';

// Context para compartir estado con los hijos
const StepperContext = createContext<StepperContextValue | null>(null);

export function useStepperContext(): StepperContextValue {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepperContext debe usarse dentro de un StepperX');
  }
  return context;
}

export const StepperX = forwardRef<StepperXRef, StepperXProps>(
  (
    {
      steps,
      currentStep: controlledStep,
      onStepChange,
      allowFreeNavigation = false,
      canProceed: canProceedFn,
      orientation = 'horizontal',
      size = 'md',
      children,
      className = '',
      showNavigation = true,
      prevLabel = 'Anterior',
      nextLabel = 'Siguiente',
      finishLabel = 'Finalizar',
      onFinish,
      isLoading = false,
    },
    ref
  ) => {
    // Estado interno si no es controlado
    const [internalStep, setInternalStep] = useState(controlledStep ?? 0);
    const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({});
    const [localLoading, setLocalLoading] = useState(false);
    const [canProceedState, setCanProceedState] = useState(true);

    // Usar paso controlado o interno
    const currentStep = controlledStep ?? internalStep;
    const loading = isLoading || localLoading;

    // Filtrar pasos visibles segun condiciones
    const visibleSteps = useMemo(() => {
      return steps.filter((step) => !step.condition || step.condition());
    }, [steps]);

    const totalSteps = visibleSteps.length;
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;

    // Cambiar paso
    const setStep = useCallback(
      (step: number) => {
        if (step < 0 || step >= totalSteps) return;
        setInternalStep(step);
        onStepChange?.(step);
        // Limpiar error del paso
        setStepErrors((prev) => ({ ...prev, [step]: false }));
      },
      [totalSteps, onStepChange]
    );

    // Validar y avanzar
    const next = useCallback(async (): Promise<boolean> => {
      if (isLastStep) return false;

      setLocalLoading(true);
      try {
        if (canProceedFn) {
          const canGo = await canProceedFn(currentStep);
          if (!canGo) {
            setStepErrors((prev) => ({ ...prev, [currentStep]: true }));
            return false;
          }
        }

        setStep(currentStep + 1);
        return true;
      } finally {
        setLocalLoading(false);
      }
    }, [isLastStep, currentStep, canProceedFn, setStep]);

    // Retroceder
    const prev = useCallback(() => {
      if (!isFirstStep) {
        setStep(currentStep - 1);
      }
    }, [isFirstStep, currentStep, setStep]);

    // Ir a paso especifico
    const goTo = useCallback(
      async (step: number): Promise<boolean> => {
        if (step < 0 || step >= totalSteps) return false;

        // Si va hacia atras, permitir siempre
        if (step < currentStep) {
          setStep(step);
          return true;
        }

        // Si va hacia adelante
        if (!allowFreeNavigation) {
          // Solo puede ir al siguiente paso
          if (step !== currentStep + 1) return false;
          return next();
        }

        // Navegacion libre: validar todos los pasos intermedios
        setLocalLoading(true);
        try {
          for (let i = currentStep; i < step; i++) {
            if (canProceedFn) {
              const canGo = await canProceedFn(i);
              if (!canGo) {
                setStepErrors((prev) => ({ ...prev, [i]: true }));
                setStep(i);
                return false;
              }
            }
          }
          setStep(step);
          return true;
        } finally {
          setLocalLoading(false);
        }
      },
      [totalSteps, currentStep, allowFreeNavigation, canProceedFn, setStep, next]
    );

    // Reset
    const reset = useCallback(() => {
      setStep(0);
      setStepErrors({});
    }, [setStep]);

    // Exponer metodos via ref
    useImperativeHandle(
      ref,
      () => ({
        next,
        prev,
        goTo,
        getCurrentStep: () => currentStep,
        reset,
      }),
      [next, prev, goTo, currentStep, reset]
    );

    // Obtener estado del paso
    const getStepStatus = (index: number): StepStatus => {
      if (stepErrors[index]) return 'error';
      if (index < currentStep) return 'completed';
      if (index === currentStep) return 'current';
      return 'pending';
    };

    // Manejar click en paso
    const handleStepClick = (index: number) => {
      if (allowFreeNavigation || index < currentStep) {
        goTo(index);
      }
    };

    // Manejar finalizar
    const handleFinish = async () => {
      setLocalLoading(true);
      try {
        if (canProceedFn) {
          const canGo = await canProceedFn(currentStep);
          if (!canGo) {
            setStepErrors((prev) => ({ ...prev, [currentStep]: true }));
            return;
          }
        }
        await onFinish?.();
      } finally {
        setLocalLoading(false);
      }
    };

    // Context value
    const contextValue: StepperContextValue = {
      currentStep,
      totalSteps,
      isFirstStep,
      isLastStep,
      next,
      prev,
      goTo,
      canProceed: canProceedState,
      setCanProceed: setCanProceedState,
      isLoading: loading,
    };

    // Renderizar solo el hijo correspondiente al paso actual
    const childrenArray = Children.toArray(children);
    const currentChild = childrenArray[currentStep];

    return (
      <StepperContext.Provider value={contextValue}>
        <div className={`stepperx ${size} ${className}`}>
          {/* Indicador de progreso */}
          <div className={`stepperx-indicator ${orientation}`}>
            {visibleSteps.map((step, index) => {
              const status = getStepStatus(index);
              const isClickable = allowFreeNavigation || index < currentStep;

              return (
                <div
                  key={step.id}
                  className={`stepperx-step ${status} ${isClickable ? 'clickable' : ''}`}
                  onClick={() => isClickable && handleStepClick(index)}
                >
                  <div className="stepperx-step-circle">
                    {status !== 'completed' && (
                      <span className="step-number">{index + 1}</span>
                    )}
                  </div>

                  <div className="stepperx-step-content">
                    <span className="stepperx-step-label">
                      {step.label}
                      {step.optional && (
                        <span className="stepperx-step-optional">Opcional</span>
                      )}
                    </span>
                    {step.description && (
                      <span className="stepperx-step-description">
                        {step.description}
                      </span>
                    )}
                  </div>

                  {index < visibleSteps.length - 1 && (
                    <div className="stepperx-connector" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Contenido del paso actual */}
          <div className="stepperx-content">
            {isValidElement(currentChild)
              ? cloneElement(currentChild as ReactElement<{ stepIndex?: number }>, {
                  stepIndex: currentStep,
                })
              : currentChild}
          </div>

          {/* Navegacion */}
          {showNavigation && (
            <div className="stepperx-navigation">
              <div className="stepperx-nav-left">
                <button
                  type="button"
                  className="stepperx-btn stepperx-btn-prev"
                  onClick={prev}
                  disabled={isFirstStep || loading}
                >
                  {prevLabel}
                </button>
              </div>

              <div className="stepperx-nav-right">
                {isLastStep ? (
                  <button
                    type="button"
                    className="stepperx-btn stepperx-btn-finish"
                    onClick={handleFinish}
                    disabled={loading}
                  >
                    {loading && <span className="spinner" />}
                    {finishLabel}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="stepperx-btn stepperx-btn-next"
                    onClick={next}
                    disabled={loading}
                  >
                    {loading && <span className="spinner" />}
                    {nextLabel}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </StepperContext.Provider>
    );
  }
);

StepperX.displayName = 'StepperX';
