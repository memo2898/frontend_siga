import { useCallback } from 'react';
import type { TransaccionWizardState } from '../types';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

type StepValidationRules = {
  [stepId: string]: {
    required?: (keyof TransaccionWizardState)[];
    custom?: (state: TransaccionWizardState) => string[];
  };
};

const validationRules: StepValidationRules = {
  tipo: {
    required: ['tipoTransaccion'],
    custom: (state) => {
      const errors: string[] = [];
      if (state.tipoTransaccion === 'ENTRADA' && !state.subtipoEntrada) {
        errors.push('Debe seleccionar el subtipo de entrada');
      }
      if (state.tipoTransaccion === 'SALIDA' && !state.subtipoSalida) {
        errors.push('Debe seleccionar el subtipo de salida');
      }
      return errors;
    },
  },
  activos: {
    custom: (state) => {
      const errors: string[] = [];
      if (state.activosSeleccionados.length === 0) {
        errors.push('Debe seleccionar al menos un activo');
      }
      state.activosSeleccionados.forEach((item, index) => {
        if (item.cantidad <= 0) {
          errors.push(`Activo ${index + 1}: la cantidad debe ser mayor a 0`);
        }
        if (state.tipoTransaccion === 'ENTRADA' && item.isNew) {
          if (!item.activo.marca) {
            errors.push(`Activo ${index + 1}: la marca es requerida`);
          }
          if (!item.activo.modelo) {
            errors.push(`Activo ${index + 1}: el modelo es requerido`);
          }
          if (!item.activo.categoria_id) {
            errors.push(`Activo ${index + 1}: la categoria es requerida`);
          }
        }
      });
      // ✅ VALIDACIÓN DE datosActaCB ELIMINADA - Ya no se usa
      return errors;
    },
  },
  evidencia: {
    // Paso opcional, siempre valido
    custom: () => [],
  },
  persona: {
    custom: (state) => {
      const errors: string[] = [];
      if (!state.persona) {
        errors.push('Debe seleccionar o registrar una persona');
        return errors;
      }
      if (!state.persona.nombre) {
        errors.push('El nombre de la persona es requerido');
      }
      if (!state.persona.numero_documento) {
        errors.push('El numero de documento es requerido');
      }
      // Validaciones adicionales segun tipo de salida
      if (state.subtipoSalida === 'PRESTAMO' && !state.fechaDevolucionEsperada) {
        errors.push('La fecha de devolucion es requerida para prestamos');
      }
      if (state.subtipoSalida === 'PRESTAMO' && state.fechaDevolucionEsperada) {
        const fechaDevolucion = new Date(state.fechaDevolucionEsperada);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fechaDevolucion <= hoy) {
          errors.push('La fecha de devolucion debe ser posterior a hoy');
        }
      }
      if (state.subtipoSalida === 'DESCARGO') {
        if (!state.motivoDescargo) {
          errors.push('El motivo del descargo es requerido');
        }
        if (!state.documentoAprobacionDescargo) {
          errors.push('El documento de aprobacion es requerido');
        }
      }
      return errors;
    },
  },
  firma: {
    custom: (state) => {
      const errors: string[] = [];
      if (!state.firmaData) {
        errors.push('La firma digital es requerida');
      }
      if (!state.firmante || state.firmante.trim() === '') {
        errors.push('El nombre del firmante es requerido');
      }
      return errors;
    },
  },
  confirmacion: {
    // Ultimo paso, siempre valido
    custom: () => [],
  },
};

const stepIdByIndex: Record<number, string> = {
  0: 'tipo',
  1: 'activos',
  2: 'evidencia',
  3: 'persona',
  4: 'firma',
  5: 'confirmacion',
};

export function useStepValidation() {
  const validateStep = useCallback(
    (stepIndex: number, state: TransaccionWizardState): ValidationResult => {
      const stepId = stepIdByIndex[stepIndex];
      if (!stepId) {
        return { isValid: true, errors: [] };
      }

      const rules = validationRules[stepId];
      if (!rules) {
        return { isValid: true, errors: [] };
      }

      const errors: string[] = [];

      // Validar campos requeridos
      if (rules.required) {
        rules.required.forEach((field) => {
          const value = state[field];
          if (value === null || value === undefined || value === '') {
            errors.push(`El campo ${field} es requerido`);
          }
        });
      }

      // Validaciones custom
      if (rules.custom) {
        errors.push(...rules.custom(state));
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    },
    []
  );

  const validateAllSteps = useCallback(
    (state: TransaccionWizardState): ValidationResult => {
      const allErrors: string[] = [];

      for (let i = 0; i < 6; i++) {
        const result = validateStep(i, state);
        if (!result.isValid) {
          allErrors.push(...result.errors);
        }
      }

      return {
        isValid: allErrors.length === 0,
        errors: allErrors,
      };
    },
    [validateStep]
  );

  return {
    validateStep,
    validateAllSteps,
  };
}