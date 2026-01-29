/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Gridie React Wrapper - Types
 * 
 * Re-exporta tipos del core y define tipos específicos del wrapper
 */

// ============================================================================
// RE-EXPORT DE TIPOS DEL CORE
// ============================================================================

export type {
  GridieConfig,
  GridieHeaderConfig,
  GridieCellAction,
  GridieFilterRowConfig,
  GridieFiltersConfig,
  GridieHeaderFilterConfig,
  HeaderFilterParameter,
  GridiePageSizeConfig,
  GridieJumpToConfig,
  GridieNavigationConfig,
  GridiePagingConfig,
  GridieMode
} from './core/gridie';

export type { Language, LanguageStrings } from './core/gridie/lang';
export type { SortDirection } from './core/gridie/sortingFunctions';
export type { FilterOperator, FilterState } from './core/gridie/filteringFunctions';

// ============================================================================
// TIPOS ESPECÍFICOS DEL WRAPPER REACT
// ============================================================================

import type {
  GridieHeaderConfig,
  GridiePagingConfig,
  GridieMode,
  GridieConfig
} from './core/gridie';
import type { Language } from './core/gridie/lang';

/**
 * Evento de cambio de página
 */
export interface GridiePageChangeEvent {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

/**
 * Props del componente GridieReact
 * 
 * @template T - Tipo de los datos del body (opcional, default: any)
 */
export interface GridieReactProps<T = any> {
  // ========== Config Principal ==========
  
  /** ID único de la tabla */
  id: string;
  
  /** Configuración de columnas */
  headers: (string | GridieHeaderConfig)[];
  
  /** Datos de la tabla */
  body: T[];
  
  /** Campo identificador único para CRUD */
  identityField?: string;
  
  /** Modo de operación */
  mode?: GridieMode;
  
  /** Habilitar ordenamiento */
  enableSort?: boolean;
  
  /** Habilitar filtros */
  enableFilter?: boolean;
  
  /** Idioma de la interfaz */
  language?: Language;
  
  /** Configuración de paginación */
  paging?: GridiePagingConfig;
  
  /** Estado de carga */
  loading?: boolean;
  
  /** Texto de carga personalizado */
  loadingText?: string;

  // ========== Eventos ==========
  
  /** Callback cuando cambia la página */
  onPageChange?: (event: GridiePageChangeEvent) => void;

  // ========== Estilos ==========
  
  /** Clase CSS para el contenedor */
  className?: string;
  
  /** Estilos inline para el contenedor */
  style?: React.CSSProperties;
}

/**
 * Métodos expuestos via ref
 * 
 * Permite control imperativo del componente Gridie
 */
export interface GridieRef {
  // ========== CRUD por índice ==========
  
  /**
   * Agrega una nueva fila
   * @returns true si se agregó exitosamente
   */
  addRow(row: any): boolean;
  
  /**
   * Elimina una fila por índice
   */
  removeRow(index: number): void;
  
  /**
   * Actualiza una fila por índice
   */
  updateRow(index: number, row: any): void;

  // ========== CRUD por Identity ==========
  
  /**
   * Obtiene una fila por su valor de identidad
   */
  getRowByIdentity(value: any): any | undefined;
  
  /**
   * Verifica si existe una fila con el valor de identidad
   */
  hasRowByIdentity(value: any): boolean;
  
  /**
   * Actualiza una fila por su valor de identidad
   * @returns true si se actualizó exitosamente
   */
  updateRowByIdentity(value: any, data: Partial<any>): boolean;
  
  /**
   * Elimina una fila por su valor de identidad
   * @returns true si se eliminó exitosamente
   */
  removeRowByIdentity(value: any): boolean;

  // ========== Paginación ==========
  
  /** Navega a una página específica */
  goToPage(page: number): void;
  
  /** Navega a la página siguiente */
  nextPage(): void;
  
  /** Navega a la página anterior */
  previousPage(): void;
  
  /** Navega a la primera página */
  firstPage(): void;
  
  /** Navega a la última página */
  lastPage(): void;
  
  /** Cambia el tamaño de página */
  setPageSize(size: number): void;
  
  /** Obtiene la página actual */
  getCurrentPage(): number;
  
  /** Obtiene el total de páginas */
  getTotalPages(): number;
  
  /** Obtiene el total de items (después de filtros) */
  getTotalItems(): number;
  
  /** Obtiene el tamaño de página actual */
  getPageSize(): number;

  // ========== Data ==========
  
  /** Obtiene el body actual (filtrado y ordenado) */
  getBody(): any[];
  
  /** Obtiene el body original */
  getOriginalBody(): any[];
  
  /** Obtiene los datos de la página actual */
  getPagedBody(): any[];
  
  /** Establece nuevos datos */
  setBody(data: any[]): void;
  
  /** Establece nuevos headers */
  setHeaders(headers: (string | GridieHeaderConfig)[]): void;
  
  /** Establece headers y datos */
  setData(config: { headers: (string | GridieHeaderConfig)[]; data: any[] }): void;
  
  /** Establece toda la configuración */
  setConfig(config: GridieConfig): void;

  // ========== Filtros ==========
  
  /** Limpia todos los filtros */
  clearAllFilters(): void;

  // ========== Utilidades ==========
  
  /** Establece el estado de carga */
  setLoading(loading: boolean): void;
  
  /** Re-renderiza la tabla */
  refresh(): void;
  
  /** Re-aplica filtros y sorting */
  reapply(): void;
  
  /** Muestra información de debug del identityField */
  debugIdentityField(): void;

  // ========== Escape Hatch ==========
  
  /**
   * Acceso directo al Web Component
   * Usar solo si necesitas algo no expuesto en esta interfaz
   */
  getElement(): InstanceType<typeof import('./core/gridie').Gridie> | null;
}

/**
 * Tipo helper para identificar arrays de acciones/contenido dinámico
 */
export interface DynamicCellAction {
  content: string;
  event: string;
  funct: (rowData: any, rowIndex: number) => void;
}

/**
 * Type guard para verificar si un valor es un array de acciones
 */
export function isDynamicCellActionArray(value: unknown): value is DynamicCellAction[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        'content' in item &&
        'event' in item &&
        'funct' in item &&
        typeof item.content === 'string' &&
        typeof item.event === 'string' &&
        typeof item.funct === 'function'
    )
  );
}