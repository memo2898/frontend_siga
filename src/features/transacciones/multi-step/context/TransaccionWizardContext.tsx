import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  ReactNode,
} from 'react';
import type {
  TransaccionWizardState,
  WizardAction,
  WizardContext as WizardContextType,
  TipoTransaccion,
  SubtipoEntrada,
  SubtipoSalida,
  SUBTIPOS_ENTRADA,
  SUBTIPOS_SALIDA,
} from '../types';

// ============================================
// Estado Inicial
// ============================================

const initialState: TransaccionWizardState = {
  context: 'GLOBAL',
  moduloId: undefined,
  transaccionOrigenId: undefined,
  categoriasPermitidas: undefined,

  tipoTransaccion: null,
  subtipoEntrada: undefined,
  subtipoSalida: undefined,

  activosSeleccionados: [],
  datosActaCB: undefined,

  imagenes: [],

  persona: null,
  fechaDevolucionEsperada: undefined,
  motivoDescargo: undefined,
  comentarioDescargo: undefined,
  documentoAprobacionDescargo: undefined,

  firmaData: null,
  firmante: '',
  fechaFirma: undefined,

  observaciones: undefined,

  isLoading: false,
  isSubmitting: false,
  errors: {},
  transaccionCreada: null,
};

// ============================================
// Reducer
// ============================================

function wizardReducer(
  state: TransaccionWizardState,
  action: WizardAction
): TransaccionWizardState {
  switch (action.type) {
    case 'SET_CONTEXT':
      return {
        ...state,
        context: action.payload.context,
        moduloId: action.payload.moduloId,
        transaccionOrigenId: action.payload.transaccionOrigenId,
        categoriasPermitidas: action.payload.categoriasPermitidas,
      };

    case 'SET_TIPO_TRANSACCION':
      return {
        ...state,
        tipoTransaccion: action.payload.tipo,
        // Limpiar subtipo al cambiar tipo
        subtipoEntrada: undefined,
        subtipoSalida: undefined,
        // Limpiar activos al cambiar tipo
        activosSeleccionados: [],
        // Limpiar imágenes al cambiar tipo
        imagenes: [],
      };

    case 'SET_SUBTIPO_ENTRADA':
      return {
        ...state,
        subtipoEntrada: action.payload,
      };

    case 'SET_SUBTIPO_SALIDA':
      return {
        ...state,
        subtipoSalida: action.payload,
      };

    case 'ADD_ACTIVO':
      return {
        ...state,
        activosSeleccionados: [...state.activosSeleccionados, action.payload],
      };

    case 'REMOVE_ACTIVO':
      const indexToRemove = action.payload;
      
      // Limpiar URLs de previews de las imágenes del activo eliminado
      state.imagenes
        .filter((img) => img.activoIndex === indexToRemove)
        .forEach((img) => {
          if (img.preview) {
            URL.revokeObjectURL(img.preview);
          }
        });
      
      return {
        ...state,
        activosSeleccionados: state.activosSeleccionados.filter(
          (_, index) => index !== indexToRemove
        ),
        // Limpiar imágenes del activo eliminado Y re-indexar las restantes
        imagenes: state.imagenes
          .filter((img) => img.activoIndex !== indexToRemove)
          .map((img) => ({
            ...img,
            // Re-indexar: si el activo estaba después del eliminado, restar 1
            activoIndex: img.activoIndex > indexToRemove 
              ? img.activoIndex - 1 
              : img.activoIndex,
          })),
      };

    case 'UPDATE_ACTIVO':
      return {
        ...state,
        activosSeleccionados: state.activosSeleccionados.map((item, index) =>
          index === action.payload.index
            ? { ...item, ...action.payload.updates }
            : item
        ),
      };

    case 'SET_ACTIVOS':
      // Si se reemplazan todos los activos, limpiar todas las imágenes
      const oldImagenes = state.imagenes;
      oldImagenes.forEach((img) => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
      
      return {
        ...state,
        activosSeleccionados: action.payload,
        imagenes: [],
      };

    case 'SET_DATOS_ACTA_CB':
      return {
        ...state,
        datosActaCB: action.payload,
      };

    case 'ADD_IMAGEN':
      return {
        ...state,
        imagenes: [...state.imagenes, action.payload],
      };

    case 'REMOVE_IMAGEN':
      const imagenToRemove = state.imagenes[action.payload];
      if (imagenToRemove?.preview) {
        URL.revokeObjectURL(imagenToRemove.preview);
      }
      
      return {
        ...state,
        imagenes: state.imagenes.filter((_, index) => index !== action.payload),
      };

    case 'SET_IMAGENES':
      return {
        ...state,
        imagenes: action.payload,
      };

    case 'SET_PERSONA':
      return {
        ...state,
        persona: action.payload,
      };

    case 'SET_FECHA_DEVOLUCION':
      return {
        ...state,
        fechaDevolucionEsperada: action.payload,
      };

    case 'SET_MOTIVO_DESCARGO':
      return {
        ...state,
        motivoDescargo: action.payload.motivo,
        comentarioDescargo: action.payload.comentario,
        documentoAprobacionDescargo: action.payload.documento,
      };

    case 'SET_FIRMA':
      return {
        ...state,
        firmaData: action.payload.data,
        firmante: action.payload.firmante,
        fechaFirma: new Date().toISOString(),
      };

    case 'CLEAR_FIRMA':
      return {
        ...state,
        firmaData: null,
        firmante: '',
        fechaFirma: undefined,
      };

    case 'SET_OBSERVACIONES':
      return {
        ...state,
        observaciones: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.errors,
        },
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {},
      };

    case 'SET_TRANSACCION_CREADA':
      return {
        ...state,
        transaccionCreada: action.payload,
      };

    case 'RESET':
      // Limpiar todas las URLs de preview antes de resetear
      state.imagenes.forEach((img) => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
      
      return {
        ...initialState,
        // Mantener contexto al resetear
        context: state.context,
        moduloId: state.moduloId,
        categoriasPermitidas: state.categoriasPermitidas,
      };

    case 'LOAD_DEVOLUCION':
      return {
        ...state,
        tipoTransaccion: 'ENTRADA',
        subtipoEntrada:
          action.payload.transaccion.tipo_salida === 'PRESTAMO'
            ? 'DEVOLUCION_PRESTAMO'
            : 'DEVOLUCION_ASIGNACION',
        activosSeleccionados: action.payload.activos.map((activo) => ({
          activo,
          cantidad: activo.cantidad || 1,
        })),
        persona: action.payload.persona,
        transaccionOrigenId: action.payload.transaccion.id,
      };

    default:
      return state;
  }
}

// ============================================
// Context
// ============================================

interface TransaccionWizardContextValue {
  state: TransaccionWizardState;
  dispatch: React.Dispatch<WizardAction>;

  // Helpers
  getTipoLabel: () => string;
  getSubtipoLabel: () => string;
  getTotalActivos: () => number;
  canSkipEvidencia: () => boolean;
  requiresFechaDevolucion: () => boolean;
  requiresMotivoDescargo: () => boolean;
  isDevolucion: () => boolean;
}

const TransaccionWizardContext = createContext<TransaccionWizardContextValue | null>(null);

// ============================================
// Provider
// ============================================

interface TransaccionWizardProviderProps {
  children: ReactNode;
  initialContext?: {
    context: WizardContextType;
    moduloId?: number;
    transaccionOrigenId?: number;
    categoriasPermitidas?: number[];
  };
}

export function TransaccionWizardProvider({
  children,
  initialContext,
}: TransaccionWizardProviderProps) {
  const [state, dispatch] = useReducer(wizardReducer, {
    ...initialState,
    ...(initialContext && {
      context: initialContext.context,
      moduloId: initialContext.moduloId,
      transaccionOrigenId: initialContext.transaccionOrigenId,
      categoriasPermitidas: initialContext.categoriasPermitidas,
    }),
  });

  const value = useMemo<TransaccionWizardContextValue>(() => {
    const getTipoLabel = (): string => {
      if (!state.tipoTransaccion) return '';
      return state.tipoTransaccion === 'ENTRADA' ? 'Entrada' : 'Salida';
    };

    const getSubtipoLabel = (): string => {
      if (state.tipoTransaccion === 'ENTRADA' && state.subtipoEntrada) {
        const subtipo = [
          { value: 'INGRESO_CB', label: 'Ingreso desde Control de Bienes' },
          { value: 'ADQUISICION_DIRECTA', label: 'Adquisicion Directa' },
          { value: 'DEVOLUCION_ASIGNACION', label: 'Devolucion de Asignacion' },
          { value: 'DEVOLUCION_PRESTAMO', label: 'Devolucion de Prestamo' },
          { value: 'TRANSFERENCIA_INTERNA', label: 'Transferencia Interna' },
          { value: 'AJUSTE_INVENTARIO', label: 'Ajuste de Inventario' },
        ].find((s) => s.value === state.subtipoEntrada);
        return subtipo?.label || '';
      }
      if (state.tipoTransaccion === 'SALIDA' && state.subtipoSalida) {
        const subtipo = [
          { value: 'ASIGNACION', label: 'Asignacion' },
          { value: 'PRESTAMO', label: 'Prestamo' },
          { value: 'DESCARGO', label: 'Descargo' },
          { value: 'TRANSFERENCIA_EXTERNA', label: 'Transferencia Externa' },
          { value: 'DEVOLUCION_PROVEEDOR', label: 'Devolucion a Proveedor' },
        ].find((s) => s.value === state.subtipoSalida);
        return subtipo?.label || '';
      }
      return '';
    };

    const getTotalActivos = (): number => {
      return state.activosSeleccionados.reduce(
        (total, item) => total + item.cantidad,
        0
      );
    };

    const canSkipEvidencia = (): boolean => {
      // La evidencia es siempre opcional
      return true;
    };

    const requiresFechaDevolucion = (): boolean => {
      return state.subtipoSalida === 'PRESTAMO';
    };

    const requiresMotivoDescargo = (): boolean => {
      return state.subtipoSalida === 'DESCARGO';
    };

    const isDevolucion = (): boolean => {
      return (
        state.subtipoEntrada === 'DEVOLUCION_ASIGNACION' ||
        state.subtipoEntrada === 'DEVOLUCION_PRESTAMO'
      );
    };

    return {
      state,
      dispatch,
      getTipoLabel,
      getSubtipoLabel,
      getTotalActivos,
      canSkipEvidencia,
      requiresFechaDevolucion,
      requiresMotivoDescargo,
      isDevolucion,
    };
  }, [state]);

  return (
    <TransaccionWizardContext.Provider value={value}>
      {children}
    </TransaccionWizardContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useTransaccionWizardContext(): TransaccionWizardContextValue {
  const context = useContext(TransaccionWizardContext);
  if (!context) {
    throw new Error(
      'useTransaccionWizardContext debe usarse dentro de TransaccionWizardProvider'
    );
  }
  return context;
}