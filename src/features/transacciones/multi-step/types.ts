import type { Activos } from '../../activos/activos.types';
import type { Personas } from '../../personas/personas.types';
import type { Transacciones } from '../transacciones.types';

// ============================================
// Props de Navegacion para Steps
// ============================================

export interface StepNavigationProps {
  onNext?: () => Promise<boolean>;
  onPrev?: () => void;
}

// ============================================
// Enums y Tipos Base
// ============================================

export type WizardContext = 'GLOBAL' | 'MODULO' | 'DEVOLUCION';

export type TipoTransaccion = 'ENTRADA' | 'SALIDA';

export type SubtipoEntrada =
  | 'INGRESO_CB'
  | 'ADQUISICION_DIRECTA'
  | 'DEVOLUCION_ASIGNACION'
  | 'DEVOLUCION_PRESTAMO'
  | 'TRANSFERENCIA_INTERNA'
  | 'AJUSTE_INVENTARIO';

export type SubtipoSalida =
  | 'ASIGNACION'
  | 'PRESTAMO'
  | 'DESCARGO'
  | 'TRANSFERENCIA_EXTERNA'
  | 'DEVOLUCION_PROVEEDOR';

export type MotivoDescargo =
  | 'DAÑO_IRREPARABLE'
  | 'OBSOLESCENCIA'
  | 'DONACION'
  | 'VENTA'
  | 'ROBO'
  | 'PERDIDA'
  | 'OTRO';

export type TipoImagen =
  | 'PRINCIPAL'
  | 'FRONTAL'
  | 'LATERAL'
  | 'POSTERIOR'
  | 'DETALLE'
  | 'NUMERO_SERIE'
  | 'PLACA_PATRIMONIAL'
  | 'DAÑO'
  | 'OTRO';

// ============================================
// Tipos para el Wizard
// ============================================

export interface ActivoSeleccionado {
  activo: Activos;
  cantidad: number;
  estadoSalida?: string;
  observacion?: string;
  /** true si es un activo nuevo creado en el wizard */
  isNew?: boolean;
  /** Accesorios incluidos (para salidas) */
  accesorios?: string[];
}

export interface ImagenEvidencia {
  file: File;
  preview: string;
  descripcion?: string;
  /** Índice del activo en activosSeleccionados al que pertenece la imagen */
  activoIndex: number;
  /** Tipo de imagen según el ENUM */
  tipo: TipoImagen;
}

export interface PersonaTransaccion extends Omit<Personas, 'agregado_por' | 'agregado_en' | 'actualizado_por' | 'actualizado_en' | 'estado'> {
  /** true si es una persona nueva creada en el wizard */
  isNew?: boolean;
}

export interface DatosActaControlBienes {
  actaControlBienes: string;
  fechaActa: string;
  codigoCB: string;
  valorUnitario?: number;
  proveedor?: string;
  factura?: string;
}

// ============================================
// Estado del Wizard
// ============================================

export interface TransaccionWizardState {
  // Contexto de uso
  context: WizardContext;
  moduloId?: number;
  transaccionOrigenId?: number;
  categoriasPermitidas?: number[];

  // Paso 1: Tipo de transaccion
  tipoTransaccion: TipoTransaccion | null;
  subtipoEntrada?: SubtipoEntrada;
  subtipoSalida?: SubtipoSalida;

  // Paso 2: Activos
  activosSeleccionados: ActivoSeleccionado[];
  datosActaCB?: DatosActaControlBienes;

  // Paso 3: Evidencia (opcional)
  imagenes: ImagenEvidencia[];

  // Paso 4: Persona
  persona: PersonaTransaccion | null;
  fechaDevolucionEsperada?: string;
  motivoDescargo?: MotivoDescargo;
  comentarioDescargo?: string;
  documentoAprobacionDescargo?: string;

  // Paso 5: Firma
  firmaData: string | null;
  firmante: string;
  fechaFirma?: string;

  // Paso 6: Confirmacion
  observaciones?: string;

  // Meta
  isLoading: boolean;
  isSubmitting: boolean;
  errors: Record<string, string[]>;
  transaccionCreada: Transacciones | null;
}

// ============================================
// Actions del Reducer
// ============================================

export type WizardAction =
  | { type: 'SET_CONTEXT'; payload: { context: WizardContext; moduloId?: number; transaccionOrigenId?: number; categoriasPermitidas?: number[] } }
  | { type: 'SET_TIPO_TRANSACCION'; payload: { tipo: TipoTransaccion } }
  | { type: 'SET_SUBTIPO_ENTRADA'; payload: SubtipoEntrada }
  | { type: 'SET_SUBTIPO_SALIDA'; payload: SubtipoSalida }
  | { type: 'ADD_ACTIVO'; payload: ActivoSeleccionado }
  | { type: 'REMOVE_ACTIVO'; payload: number }
  | { type: 'UPDATE_ACTIVO'; payload: { index: number; updates: Partial<ActivoSeleccionado> } }
  | { type: 'SET_ACTIVOS'; payload: ActivoSeleccionado[] }
  | { type: 'SET_DATOS_ACTA_CB'; payload: DatosActaControlBienes }
  | { type: 'ADD_IMAGEN'; payload: ImagenEvidencia }
  | { type: 'REMOVE_IMAGEN'; payload: number }
  | { type: 'SET_IMAGENES'; payload: ImagenEvidencia[] }
  | { type: 'SET_PERSONA'; payload: PersonaTransaccion | null }
  | { type: 'SET_FECHA_DEVOLUCION'; payload: string }
  | { type: 'SET_MOTIVO_DESCARGO'; payload: { motivo: MotivoDescargo; comentario?: string; documento?: string } }
  | { type: 'SET_FIRMA'; payload: { data: string; firmante: string } }
  | { type: 'CLEAR_FIRMA' }
  | { type: 'SET_OBSERVACIONES'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { field: string; errors: string[] } }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_TRANSACCION_CREADA'; payload: Transacciones }
  | { type: 'RESET' }
  | { type: 'LOAD_DEVOLUCION'; payload: { transaccion: Transacciones; activos: Activos[]; persona: Personas } };

// ============================================
// Props del Componente Principal
// ============================================

export interface TransaccionMultiStepProps {
  contexto: {
    tipo: WizardContext;
    moduloId?: number;
    categorias?: number[];
    transaccionOrigenId?: number;
  };
  onComplete?: (transaccion: Transacciones) => void;
  onCancel?: () => void;
}

// ============================================
// Labels y Opciones
// ============================================

export const SUBTIPOS_ENTRADA: { value: SubtipoEntrada; label: string; description: string }[] = [
  { value: 'INGRESO_CB', label: 'Ingreso desde Control de Bienes', description: 'Requiere acta de Control de Bienes' },
  { value: 'ADQUISICION_DIRECTA', label: 'Adquisicion Directa', description: 'Sin Control de Bienes (consumibles)' },
  { value: 'DEVOLUCION_ASIGNACION', label: 'Devolucion de Asignacion', description: 'Retorno de activo asignado' },
  { value: 'DEVOLUCION_PRESTAMO', label: 'Devolucion de Prestamo', description: 'Retorno de activo prestado' },
  { value: 'TRANSFERENCIA_INTERNA', label: 'Transferencia Interna', description: 'Recepcion desde otro departamento' },
  { value: 'AJUSTE_INVENTARIO', label: 'Ajuste de Inventario', description: 'Correccion de inventario' },
];

export const SUBTIPOS_SALIDA: { value: SubtipoSalida; label: string; description: string }[] = [
  { value: 'ASIGNACION', label: 'Asignacion', description: 'Entrega permanente a una persona' },
  { value: 'PRESTAMO', label: 'Prestamo', description: 'Entrega temporal con fecha de devolucion' },
  { value: 'DESCARGO', label: 'Descargo', description: 'Baja definitiva del activo' },
  { value: 'TRANSFERENCIA_EXTERNA', label: 'Transferencia Externa', description: 'Envio a otra institucion' },
  { value: 'DEVOLUCION_PROVEEDOR', label: 'Devolucion a Proveedor', description: 'Por defecto o garantia' },
];

export const MOTIVOS_DESCARGO: { value: MotivoDescargo; label: string }[] = [
  { value: 'DAÑO_IRREPARABLE', label: 'Dano Irreparable' },
  { value: 'OBSOLESCENCIA', label: 'Obsolescencia' },
  { value: 'DONACION', label: 'Donacion' },
  { value: 'VENTA', label: 'Venta' },
  { value: 'ROBO', label: 'Robo' },
  { value: 'PERDIDA', label: 'Perdida' },
  { value: 'OTRO', label: 'Otro' },
];

export const TIPOS_IMAGEN: { value: TipoImagen; label: string }[] = [
  { value: 'PRINCIPAL', label: 'Principal' },
  { value: 'FRONTAL', label: 'Frontal' },
  { value: 'LATERAL', label: 'Lateral' },
  { value: 'POSTERIOR', label: 'Posterior' },
  { value: 'DETALLE', label: 'Detalle' },
  { value: 'NUMERO_SERIE', label: 'Numero de Serie' },
  { value: 'PLACA_PATRIMONIAL', label: 'Placa Patrimonial' },
  { value: 'DAÑO', label: 'Dano' },
  { value: 'OTRO', label: 'Otro' },
];
