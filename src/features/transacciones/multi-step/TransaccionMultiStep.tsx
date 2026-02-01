import { useRef, useCallback } from 'react';
import { TransaccionWizardProvider, useTransaccionWizardContext } from './context/TransaccionWizardContext';
import { useTransaccionWizard } from './hooks/useTransaccionWizard';
import { useStepValidation } from './hooks/useStepValidation';
import { StepperX, type StepperXRef } from '../../../lib/uiX';
import { Step1TipoTransaccion } from './steps/Step1TipoTransaccion';
import { Step2Activos } from './steps/Step2Activos';
import { Step3Evidencia } from './steps/Step3Evidencia';
import { Step4Persona } from './steps/Step4Persona';
import { Step5Firma } from './steps/Step5Firma';
import { Step6Confirmacion } from './steps/Step6Confirmacion';
import type { TransaccionMultiStepProps } from './types';
import './TransaccionMultiStep.css';

function TransaccionMultiStepContent({
  onComplete,
  onCancel,
}: {
  onComplete?: TransaccionMultiStepProps['onComplete'];
  onCancel?: TransaccionMultiStepProps['onCancel'];
}) {
  const stepperRef = useRef<StepperXRef>(null);
  const { state } = useTransaccionWizardContext();
  const { validateStep } = useStepValidation();
  const {
    stepConfig,
    isSubmitting,
    isComplete,
    reset,
  } = useTransaccionWizard({
    onComplete,
    onCancel,
  });

  // Validar antes de avanzar
  const handleCanProceed = useCallback(
    async (stepIndex: number): Promise<boolean> => {
      // El paso de evidencia es opcional
      if (stepIndex === 2) return true;

      const validation = validateStep(stepIndex, state);
      return validation.isValid;
    },
    [validateStep, state]
  );

  // Manejar finalizacion
  const handleFinish = useCallback(async () => {
    // La confirmacion se maneja dentro del Step6
  }, []);

  // Manejar nueva transaccion
  const handleNewTransaction = useCallback(() => {
    reset();
    stepperRef.current?.reset();
  }, [reset]);

  return (
    <div className="transaccion-multistep">
      <div className="transaccion-multistep-header">
        <h1 className="transaccion-multistep-title">
          {state.tipoTransaccion === 'ENTRADA' ? 'Nueva Entrada' :
           state.tipoTransaccion === 'SALIDA' ? 'Nueva Salida' :
           'Nueva Transaccion'}
        </h1>
        {onCancel && !isComplete && (
          <button
            type="button"
            className="transaccion-multistep-cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
      </div>

      <StepperX
        ref={stepperRef}
        steps={stepConfig}
        canProceed={handleCanProceed}
        onFinish={handleFinish}
        showNavigation={!isComplete}
        isLoading={isSubmitting}
        prevLabel="Anterior"
        nextLabel="Siguiente"
        finishLabel="Revisar"
        size="md"
      >
        <Step1TipoTransaccion />
        <Step2Activos />
        <Step3Evidencia />
        <Step4Persona />
        <Step5Firma />
        <Step6Confirmacion
          onComplete={onComplete}
          onNewTransaction={handleNewTransaction}
        />
      </StepperX>
    </div>
  );
}

export function TransaccionMultiStep({
  contexto,
  onComplete,
  onCancel,
}: TransaccionMultiStepProps) {
  return (
    <TransaccionWizardProvider
      initialContext={{
        context: contexto.tipo,
        moduloId: contexto.moduloId,
        transaccionOrigenId: contexto.transaccionOrigenId,
        categoriasPermitidas: contexto.categorias,
      }}
    >
      <TransaccionMultiStepContent
        onComplete={onComplete}
        onCancel={onCancel}
      />
    </TransaccionWizardProvider>
  );
}
