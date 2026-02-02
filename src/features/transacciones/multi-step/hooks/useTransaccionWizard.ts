import { useState, useCallback, useMemo } from 'react';
import { useTransaccionWizardContext } from '../context/TransaccionWizardContext';
import { useStepValidation } from './useStepValidation';
import type { StepDefinition } from '../../../../lib/uiX';
import type { Transacciones, TransaccionesCreateDTO } from '../../transacciones.types';
import * as transaccionesService from '../../transacciones.service';
import * as transaccionesdetalleService from '../../../transaccionesdetalle/transaccionesdetalle.service';
import * as transaccionesdetalleimagenesService from '../../../transaccionesdetalleimagenes/transaccionesdetalleimagenes.service';
import * as activosService from '../../../activos/activos.service';
import * as personasService from '../../../personas/personas.service';

interface UseTransaccionWizardOptions {
  onComplete?: (transaccion: Transacciones) => void;
  onCancel?: () => void;
}

interface UseTransaccionWizardReturn {
  // Estado del wizard
  currentStep: number;
  totalSteps: number;
  stepConfig: StepDefinition[];

  // Navegacion
  next: () => Promise<boolean>;
  prev: () => void;
  goToStep: (step: number) => Promise<boolean>;

  // Validacion
  validateCurrentStep: () => { isValid: boolean; errors: string[] };
  getStepErrors: () => string[];

  // Acciones finales
  submit: () => Promise<boolean>;
  cancel: () => void;
  reset: () => void;

  // Estado
  isSubmitting: boolean;
  isComplete: boolean;
  transaccionCreada: Transacciones | null;
  submitError: string | null;
}

export function useTransaccionWizard(
  options: UseTransaccionWizardOptions = {}
): UseTransaccionWizardReturn {
  const { onComplete, onCancel } = options;
  const { state, dispatch } = useTransaccionWizardContext();
  const { validateStep } = useStepValidation();

  const [currentStep, setCurrentStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Configuracion de pasos
  const stepConfig = useMemo<StepDefinition[]>(() => {
    return [
      {
        id: 'tipo',
        label: 'Tipo',
        description: 'Seleccione tipo de transaccion',
      },
      {
        id: 'activos',
        label: 'Activos',
        description: 'Seleccione o registre activos',
      },
      {
        id: 'evidencia',
        label: 'Evidencia',
        description: 'Fotos del proceso',
        optional: true,
      },
      {
        id: 'persona',
        label: 'Persona',
        description: 'Datos del solicitante/receptor',
      },
      {
        id: 'firma',
        label: 'Firma',
        description: 'Firma digital',
      },
      {
        id: 'confirmacion',
        label: 'Confirmacion',
        description: 'Revisar y confirmar',
      },
    ];
  }, []);

  const totalSteps = stepConfig.length;
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  // Validar paso actual
  const validateCurrentStep = useCallback(() => {
    return validateStep(currentStep, state);
  }, [currentStep, state, validateStep]);

  // Obtener errores del paso actual
  const getStepErrors = useCallback(() => {
    const result = validateStep(currentStep, state);
    return result.errors;
  }, [currentStep, state, validateStep]);

  // Avanzar
  const next = useCallback(async (): Promise<boolean> => {
    if (isLastStep) return false;

    // El paso de evidencia es opcional
    if (currentStep === 2) {
      setCurrentStep((prev) => prev + 1);
      return true;
    }

    const validation = validateStep(currentStep, state);
    if (!validation.isValid) {
      dispatch({
        type: 'SET_ERROR',
        payload: { field: `step_${currentStep}`, errors: validation.errors },
      });
      return false;
    }

    dispatch({ type: 'CLEAR_ERRORS' });
    setCurrentStep((prev) => prev + 1);
    return true;
  }, [isLastStep, currentStep, state, validateStep, dispatch]);

  // Retroceder
  const prev = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [isFirstStep]);

  // Ir a paso especifico
  const goToStep = useCallback(
    async (step: number): Promise<boolean> => {
      if (step < 0 || step >= totalSteps) return false;

      // Permitir ir hacia atras siempre
      if (step < currentStep) {
        setCurrentStep(step);
        return true;
      }

      // Para ir hacia adelante, validar pasos intermedios
      for (let i = currentStep; i < step; i++) {
        // Saltar validacion del paso de evidencia
        if (i === 2) continue;

        const validation = validateStep(i, state);
        if (!validation.isValid) {
          setCurrentStep(i);
          dispatch({
            type: 'SET_ERROR',
            payload: { field: `step_${i}`, errors: validation.errors },
          });
          return false;
        }
      }

      setCurrentStep(step);
      return true;
    },
    [totalSteps, currentStep, state, validateStep, dispatch]
  );

  // Submit final
  const submit = useCallback(async (): Promise<boolean> => {
    // Validar ultimo paso
    const validation = validateStep(currentStep, state);
    if (!validation.isValid) {
      dispatch({
        type: 'SET_ERROR',
        payload: { field: `step_${currentStep}`, errors: validation.errors },
      });
      return false;
    }

    dispatch({ type: 'SET_SUBMITTING', payload: true });
    setSubmitError(null);

    try {
      // 1. Crear persona nueva si aplica
      let personaId = state.persona?.id;
      if (state.persona?.isNew && !personaId) {
        const nuevaPersona = await personasService.create({
          nombre: state.persona.nombre,
          tipo_documento_id: state.persona.tipo_documento_id,
          numero_documento: state.persona.numero_documento,
          cargo: state.persona.cargo,
          telefono: state.persona.telefono,
          correo: state.persona.correo,
          departamento_id: state.persona.departamento_id,
        });
        personaId = nuevaPersona.id;
      }

      // 2. Crear activos nuevos si aplica (solo para entradas)
      const activosIds: { activoId: number; cantidad: number; observacion?: string }[] = [];

      for (const item of state.activosSeleccionados) {
        if (item.isNew && state.tipoTransaccion === 'ENTRADA') {
          const nuevoActivo = await activosService.create({
            codigo_inventario_control_bienes: state.datosActaCB?.codigoCB,
            marca: item.activo.marca,
            modelo: item.activo.modelo,
            categoria_id: item.activo.categoria_id,
            almacen_id: item.activo.almacen_id,
            estado_activo: 'DISPONIBLE',
            cantidad: item.cantidad,
            unidad_medida: item.activo.unidad_medida,
            atributos: item.activo.atributos,
            fecha_ingreso: new Date().toISOString().split('T')[0],
            observaciones: item.observacion,
          });
          activosIds.push({
            activoId: nuevoActivo.id!,
            cantidad: item.cantidad,
            observacion: item.observacion,
          });
        } else if (item.activo.id) {
          activosIds.push({
            activoId: item.activo.id,
            cantidad: item.cantidad,
            observacion: item.observacion,
          });
        }
      }

      // 3. Crear transaccion
      const transaccionData: TransaccionesCreateDTO = {
        modulo_id: state.moduloId,
        persona_id: personaId,
        tipo: state.tipoTransaccion,
        tipo_salida: state.tipoTransaccion === 'SALIDA' ? state.subtipoSalida : state.subtipoEntrada,
        fecha: new Date().toISOString(),
        fecha_devolucion_esperada: state.fechaDevolucionEsperada,
        motivo_descargo: state.motivoDescargo,
        comentario_descargo: state.comentarioDescargo,
        metadata: {
          firma: state.firmaData,
          firmante: state.firmante,
          fechaFirma: state.fechaFirma,
          datosActaCB: state.datosActaCB,
        },
        observaciones: state.observaciones,
      };

      const transaccion = await transaccionesService.create(transaccionData);

      // 4. Crear transacciones_detalle y mapear por activoId para las imagenes
      const detallesPorActivo: Map<number, number> = new Map();

      for (const item of activosIds) {
        const detalle = await transaccionesdetalleService.create({
          transaccion_id: transaccion.id,
          activo_id: item.activoId,
          cantidad: item.cantidad,
          observacion: item.observacion,
        });

        // Guardar el ID del detalle para asociar imagenes despues
        if (detalle.id) {
          detallesPorActivo.set(item.activoId, detalle.id);
        }

        // Actualizar estado del activo si es salida
        if (state.tipoTransaccion === 'SALIDA') {
          let nuevoEstado = 'DISPONIBLE';
          if (state.subtipoSalida === 'ASIGNACION') nuevoEstado = 'ASIGNADO';
          else if (state.subtipoSalida === 'PRESTAMO') nuevoEstado = 'PRESTADO';
          else if (state.subtipoSalida === 'DESCARGO') nuevoEstado = 'DESCARGADO';

          await activosService.update(item.activoId, { estado_activo: nuevoEstado });
        }
      }

      // 5. Subir imagenes (si las hay)
      // Nota: Aqui se deberia usar un servicio de uploads
      // Por ahora solo guardamos la referencia
      for (let i = 0; i < state.imagenes.length; i++) {
        const imagen = state.imagenes[i];
        // Obtener el transaccion_detalle_id correspondiente al activo de la imagen
        const transaccionDetalleId = imagen.activoId
          ? detallesPorActivo.get(imagen.activoId)
          : undefined;

        await transaccionesdetalleimagenesService.create({
          transaccion_detalle_id: transaccionDetalleId,
          tipo: state.tipoTransaccion === 'ENTRADA' ? 'ENTRADA' : 'SALIDA',
          url: imagen.preview, // En produccion esto seria la URL del servidor
          descripcion: imagen.descripcion,
          orden: i + 1,
        });
      }

      dispatch({ type: 'SET_TRANSACCION_CREADA', payload: transaccion });
      onComplete?.(transaccion);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la transaccion';
      setSubmitError(errorMessage);
      dispatch({
        type: 'SET_ERROR',
        payload: { field: 'submit', errors: [errorMessage] },
      });
      return false;
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  }, [currentStep, state, validateStep, dispatch, onComplete]);

  // Cancelar
  const cancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  // Reset
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    setCurrentStep(0);
    setSubmitError(null);
  }, [dispatch]);

  return {
    currentStep,
    totalSteps,
    stepConfig,
    next,
    prev,
    goToStep,
    validateCurrentStep,
    getStepErrors,
    submit,
    cancel,
    reset,
    isSubmitting: state.isSubmitting,
    isComplete: state.transaccionCreada !== null,
    transaccionCreada: state.transaccionCreada,
    submitError,
  };
}
