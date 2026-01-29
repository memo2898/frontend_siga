/**
 * Gridie React Wrapper
 * 
 * Entry point que exporta el componente y todos los tipos necesarios
 * 
 * @example
 * ```tsx
 * import { GridieReact } from './gridie-react';
 * import type { GridieRef, GridieReactProps, GridieHeaderConfig } from './gridie-react';
 * 
 * const MyTable = () => {
 *   const gridRef = useRef<GridieRef>(null);
 *   
 *   return (
 *     <GridieReact
 *       ref={gridRef}
 *       id="my-table"
 *       headers={[...]}
 *       body={[...]}
 *       onPageChange={(e) => console.log(e)}
 *     />
 *   );
 * };
 * ```
 */

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export { GridieReact } from './GridieReact';

// ============================================================================
// TIPOS DEL WRAPPER
// ============================================================================

export type {
  GridieReactProps,
  GridieRef,
  GridiePageChangeEvent,
  DynamicCellAction,
} from './types';

export { isDynamicCellActionArray } from './types';

// ============================================================================
// RE-EXPORT DE TIPOS DEL CORE
// ============================================================================

// Configuración
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
  GridieMode,
} from './types';

// Idioma
export type { Language, LanguageStrings } from './types';

// Sorting
export type { SortDirection } from './types';

// Filtering
export type { FilterOperator, FilterState } from './types';

// ============================================================================
// ACCESO DIRECTO AL CORE (para casos avanzados)
// ============================================================================

export { Gridie } from './core/gridie';