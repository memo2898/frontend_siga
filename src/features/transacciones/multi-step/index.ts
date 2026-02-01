// Componente principal
export { TransaccionMultiStep } from './TransaccionMultiStep';

// Context y Provider
export {
  TransaccionWizardProvider,
  useTransaccionWizardContext,
} from './context/TransaccionWizardContext';

// Hooks
export { useTransaccionWizard } from './hooks/useTransaccionWizard';
export { useStepValidation } from './hooks/useStepValidation';
export { useActivosDisponibles } from './hooks/useActivosDisponibles';
export { usePersonaBusqueda } from './hooks/usePersonaBusqueda';

// Types
export type {
  TransaccionMultiStepProps,
  TransaccionWizardState,
  WizardAction,
  WizardContext,
  TipoTransaccion,
  SubtipoEntrada,
  SubtipoSalida,
  MotivoDescargo,
  ActivoSeleccionado,
  ImagenEvidencia,
  PersonaTransaccion,
  DatosActaControlBienes,
} from './types';

// Constantes
export {
  SUBTIPOS_ENTRADA,
  SUBTIPOS_SALIDA,
  MOTIVOS_DESCARGO,
} from './types';
