/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * GridieReact - React Wrapper for Gridie Web Component
 *
 * Proporciona integración type-safe entre React y el Web Component Gridie,
 * manejando correctamente el ciclo de vida, eventos y referencias de funciones.
 */

import React, {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  memo,
  useLayoutEffect,
} from 'react';

import { Gridie } from './core/gridie';
import type { GridieConfig, GridieHeaderConfig } from './core/gridie';
import type {
  GridieReactProps,
  GridieRef,
  GridiePageChangeEvent,
  DynamicCellAction,
} from './types';
import { isDynamicCellActionArray } from './types';

// ============================================================================
// UTILIDADES INTERNAS
// ============================================================================

/**
 * Genera una key única para identificar una función en el Map
 */
function generateFunctionKey(
  rowIndex: number,
  fieldName: string,
  actionIndex: number
): string {
  return `${rowIndex}::${fieldName}::${actionIndex}`;
}

/**
 * Procesa el body y reemplaza las funciones con proxies estables
 */
function processBodyWithStableFunctions(
  body: any[],
  functionsMapRef: React.MutableRefObject<Map<string, Function>>
): any[] {
  return body.map((row, rowIndex) => {
    const processedRow: any = {};

    for (const [fieldName, fieldValue] of Object.entries(row)) {
      if (isDynamicCellActionArray(fieldValue)) {
        // Es un array de acciones dinámicas - crear proxies estables
        processedRow[fieldName] = fieldValue.map((action, actionIndex) => {
          const key = generateFunctionKey(rowIndex, fieldName, actionIndex);

          // Guardar la función actual en el Map
          functionsMapRef.current.set(key, action.funct);

          // Retornar la acción con un proxy estable
          return {
            content: action.content,
            event: action.event,
            funct: (rowData: any, idx: number) => {
              // Siempre llamar a la versión más reciente del Map
              const currentFn = functionsMapRef.current.get(key);
              if (currentFn) {
                currentFn(rowData, idx);
              }
            },
          };
        });
      } else {
        // Valor normal - pasar tal cual
        processedRow[fieldName] = fieldValue;
      }
    }

    return processedRow;
  });
}

/**
 * Actualiza las funciones en el Map sin recrear los proxies
 */
function updateFunctionsMap(
  body: any[],
  functionsMapRef: React.MutableRefObject<Map<string, Function>>
): void {
  body.forEach((row, rowIndex) => {
    for (const [fieldName, fieldValue] of Object.entries(row)) {
      if (isDynamicCellActionArray(fieldValue)) {
        fieldValue.forEach((action, actionIndex) => {
          const key = generateFunctionKey(rowIndex, fieldName, actionIndex);
          functionsMapRef.current.set(key, action.funct);
        });
      }
    }
  });
}

/**
 * Compara si dos arrays de headers son iguales (shallow)
 */
function headersAreEqual(
  prev: (string | GridieHeaderConfig)[],
  next: (string | GridieHeaderConfig)[]
): boolean {
  if (prev.length !== next.length) return false;

  return prev.every((header, index) => {
    const nextHeader = next[index];
    if (typeof header === 'string' && typeof nextHeader === 'string') {
      return header === nextHeader;
    }
    // Para objetos, comparar referencia (asumimos que el usuario usa useMemo)
    return header === nextHeader;
  });
}

/**
 * Compara si dos configs de paging son iguales (shallow)
 */
function pagingIsEqual(
  prev: GridieReactProps['paging'],
  next: GridieReactProps['paging']
): boolean {
  if (prev === next) return true;
  if (!prev || !next) return false;

  // Comparación shallow de las propiedades principales
  return JSON.stringify(prev) === JSON.stringify(next);
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * GridieReact - Wrapper de React para el Web Component Gridie
 *
 * @example
 * ```tsx
 * const gridRef = useRef<GridieRef>(null);
 *
 * <GridieReact
 *   ref={gridRef}
 *   id="mi-tabla"
 *   headers={headers}
 *   body={data}
 *   identityField="id"
 *   enableSort
 *   enableFilter
 *   language="es"
 *   paging={{ enabled: true, pageSize: { default: 10 } }}
 *   onPageChange={(e) => console.log(e)}
 * />
 *
 * // Uso imperativo
 * gridRef.current?.goToPage(2);
 * gridRef.current?.clearAllFilters();
 * ```
 */
function GridieReactInner<T = any>(
  props: GridieReactProps<T>,
  ref: React.ForwardedRef<GridieRef>
) {
  const {
    id,
    headers,
    body,
    identityField,
    mode = 'client',
    enableSort = true,
    enableFilter = false,
    language = 'es',
    paging,
    loading,
    loadingText,
    onPageChange,
    className,
    style,
  } = props;

  // ========== REFS ==========

  /** Referencia al contenedor div */
  const containerRef = useRef<HTMLDivElement>(null);

  /** Referencia al Web Component Gridie */
  const gridieRef = useRef<Gridie | null>(null);

  /** Map de funciones actualizadas (para evitar stale closures) */
  const functionsMapRef = useRef<Map<string, Function>>(new Map());

  /** Flag para saber si es el primer render */
  const isFirstRenderRef = useRef(true);

  /** Refs para comparar cambios en props */
  const prevPropsRef = useRef<{
    headers: (string | GridieHeaderConfig)[];
    body: any[];
    language: string;
    paging: GridieReactProps['paging'];
    loading: boolean | undefined;
  }>({
    headers: [],
    body: [],
    language: 'es',
    paging: undefined,
    loading: undefined,
  });

  /** Body procesado con funciones estables (se crea solo una vez por body reference) */
  const processedBodyRef = useRef<any[]>([]);

  // ========== CALLBACKS ESTABLES ==========

  const handlePageChange = useCallback(
    (event: CustomEvent<GridiePageChangeEvent>) => {
      onPageChange?.(event.detail);
    },
    [onPageChange]
  );

  // ========== INICIALIZACIÓN ==========

  // Usar useLayoutEffect para crear el componente antes del paint
  useLayoutEffect(() => {
    if (!containerRef.current || gridieRef.current) return;

    // Limpiar el Map de funciones
    functionsMapRef.current.clear();

    // Procesar body con funciones estables
    const processedBody = processBodyWithStableFunctions(body, functionsMapRef);
    processedBodyRef.current = processedBody;

    // Crear configuración inicial
    const config: GridieConfig = {
      id,
      headers,
      body: processedBody,
      identityField,
      mode,
      enableSort,
      enableFilter,
      language,
      paging,
      loading,
      loadingText,
    };

    // Crear instancia de Gridie
    const gridie = new Gridie(config);
    gridieRef.current = gridie;

    // Montar en el DOM
    containerRef.current.appendChild(gridie);

    // Agregar event listener
    gridie.addEventListener('pagechange', handlePageChange as EventListener);

    // Guardar props iniciales para comparar después
    prevPropsRef.current = {
      headers,
      body,
      language,
      paging,
      loading,
    };

    isFirstRenderRef.current = false;

    // Cleanup
    return () => {
      gridie.removeEventListener('pagechange', handlePageChange as EventListener);
      gridie.destroy();
      gridieRef.current = null;
      functionsMapRef.current.clear();
    };
    // Solo ejecutar en mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========== ACTUALIZACIÓN DE PROPS ==========

  useEffect(() => {
    // Skip primer render (ya se manejó en useLayoutEffect)
    if (isFirstRenderRef.current || !gridieRef.current) return;

    const gridie = gridieRef.current;
    const prevProps = prevPropsRef.current;

    // ===== Actualizar funciones en el Map (siempre) =====
    // Esto asegura que las closures estén actualizadas
    updateFunctionsMap(body, functionsMapRef);

    // ===== Detectar si cambió la referencia del body =====
    if (body !== prevProps.body) {
      // El body cambió - procesar y actualizar
      const processedBody = processBodyWithStableFunctions(body, functionsMapRef);
      processedBodyRef.current = processedBody;

      // Solo llamar setBody si realmente cambió la referencia
      gridie.setBody(processedBody);
      prevProps.body = body;
    }

    // ===== Detectar si cambiaron los headers =====
    if (!headersAreEqual(headers, prevProps.headers)) {
      gridie.setHeaders(headers);
      prevProps.headers = headers;
    }

    // ===== Detectar si cambió el language =====
    if (language !== prevProps.language) {
      gridie.setConfig({
        ...props,
        body: processedBodyRef.current,
      } as GridieConfig);
      prevProps.language = language;
    }

    // ===== Detectar si cambió paging =====
    if (!pagingIsEqual(paging, prevProps.paging)) {
      gridie.setConfig({
        ...props,
        body: processedBodyRef.current,
      } as GridieConfig);
      prevProps.paging = paging;
    }

    // ===== Detectar si cambió loading =====
    if (loading !== prevProps.loading) {
      gridie.setLoading(!!loading);
      prevProps.loading = loading;
    }
  });

  // ========== ACTUALIZAR EVENT HANDLER ==========

  useEffect(() => {
    const gridie = gridieRef.current;
    if (!gridie) return;

    // Remover listener anterior y agregar nuevo
    // Esto asegura que onPageChange siempre tenga la referencia correcta
    const handler = handlePageChange as EventListener;

    gridie.addEventListener('pagechange', handler);

    return () => {
      gridie.removeEventListener('pagechange', handler);
    };
  }, [handlePageChange]);

  // ========== IMPERATIVE HANDLE ==========

  useImperativeHandle(
    ref,
    () => ({
      // CRUD por índice
      addRow: (row: any) => {
        if (!gridieRef.current) return false;
        // Procesar el row si tiene acciones
        const processedRow = processBodyWithStableFunctions([row], functionsMapRef)[0];
        return gridieRef.current.addRow(processedRow);
      },
      removeRow: (index: number) => {
        gridieRef.current?.removeRow(index);
      },
      updateRow: (index: number, row: any) => {
        gridieRef.current?.updateRow(index, row);
      },

      // CRUD por Identity
      getRowByIdentity: (value: any) => {
        return gridieRef.current?.getRowByIdentity(value);
      },
      hasRowByIdentity: (value: any) => {
        return gridieRef.current?.hasRowByIdentity(value) ?? false;
      },
      updateRowByIdentity: (value: any, data: Partial<any>) => {
        return gridieRef.current?.updateRowByIdentity(value, data) ?? false;
      },
      removeRowByIdentity: (value: any) => {
        return gridieRef.current?.removeRowByIdentity(value) ?? false;
      },

      // Paginación
      goToPage: (page: number) => {
        gridieRef.current?.goToPage(page);
      },
      nextPage: () => {
        gridieRef.current?.nextPage();
      },
      previousPage: () => {
        gridieRef.current?.previousPage();
      },
      firstPage: () => {
        gridieRef.current?.firstPage();
      },
      lastPage: () => {
        gridieRef.current?.lastPage();
      },
      setPageSize: (size: number) => {
        gridieRef.current?.setPageSize(size);
      },
      getCurrentPage: () => {
        return gridieRef.current?.getCurrentPage() ?? 1;
      },
      getTotalPages: () => {
        return gridieRef.current?.getTotalPages() ?? 1;
      },
      getTotalItems: () => {
        return gridieRef.current?.getTotalItems() ?? 0;
      },
      getPageSize: () => {
        return gridieRef.current?.getPageSize() ?? 10;
      },

      // Data
      getBody: () => {
        return gridieRef.current?.getBody() ?? [];
      },
      getOriginalBody: () => {
        return gridieRef.current?.getOriginalBody() ?? [];
      },
      getPagedBody: () => {
        return gridieRef.current?.getPagedBody() ?? [];
      },
      setBody: (data: any[]) => {
        if (!gridieRef.current) return;
        const processedBody = processBodyWithStableFunctions(data, functionsMapRef);
        processedBodyRef.current = processedBody;
        gridieRef.current.setBody(processedBody);
      },
      setHeaders: (newHeaders: (string | GridieHeaderConfig)[]) => {
        gridieRef.current?.setHeaders(newHeaders);
      },
      setData: (config: { headers: (string | GridieHeaderConfig)[]; data: any[] }) => {
        if (!gridieRef.current) return;
        const processedBody = processBodyWithStableFunctions(config.data, functionsMapRef);
        processedBodyRef.current = processedBody;
        gridieRef.current.setData({
          headers: config.headers,
          data: processedBody,
        });
      },
      setConfig: (config: GridieConfig) => {
        if (!gridieRef.current) return;
        const processedBody = processBodyWithStableFunctions(config.body, functionsMapRef);
        processedBodyRef.current = processedBody;
        gridieRef.current.setConfig({
          ...config,
          body: processedBody,
        });
      },

      // Filtros
      clearAllFilters: () => {
        gridieRef.current?.clearAllFilters();
      },

      // Utilidades
      setLoading: (isLoading: boolean) => {
        gridieRef.current?.setLoading(isLoading);
      },
      refresh: () => {
        gridieRef.current?.refresh();
      },
      reapply: () => {
        gridieRef.current?.reapply();
      },
      debugIdentityField: () => {
        gridieRef.current?.debugIdentityField();
      },

      // Escape hatch
      getElement: () => {
        return gridieRef.current;
      },
    }),
    []
  );

  // ========== RENDER ==========

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
      data-gridie-wrapper={id}
    />
  );
}

// ============================================================================
// EXPORT
// ============================================================================

/**
 * GridieReact con forwardRef y memo
 *
 * - forwardRef: permite usar ref para acceder a métodos imperativos
 * - memo: evita re-renders innecesarios cuando los props no cambian
 */
export const GridieReact = memo(forwardRef(GridieReactInner)) as <T = any>(
  props: GridieReactProps<T> & { ref?: React.ForwardedRef<GridieRef> }
) => React.ReactElement;

// Agregar displayName para debugging
(GridieReact as any).displayName = 'GridieReact';