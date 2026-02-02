import { useState, useCallback, useEffect } from 'react';
import type { Activos } from '../../../activos/activos.types';
import type { Categorias } from '../../../categorias/categorias.types';
import type { SubtipoSalida } from '../types';
import * as activosService from '../../../activos/activos.service';
import * as categoriasService from '../../../categorias/categorias.service';

// Estados de activo según el enum de la BD
type EstadoActivo = 'DISPONIBLE' | 'ASIGNADO' | 'PRESTADO' | 'MANTENIMIENTO' | 'DESCARGADO';

// Configuración de estados seleccionables por subtipo de salida
const ESTADOS_SELECCIONABLES_POR_SUBTIPO: Record<SubtipoSalida, EstadoActivo[]> = {
  ASIGNACION: ['DISPONIBLE'],
  PRESTAMO: ['DISPONIBLE'],
  DESCARGO: ['DISPONIBLE', 'ASIGNADO', 'PRESTADO'],
  TRANSFERENCIA_EXTERNA: ['DISPONIBLE'],
  DEVOLUCION_PROVEEDOR: ['DISPONIBLE'],
};

// Estados que siempre se muestran (aunque no sean seleccionables)
const ESTADOS_VISIBLES: EstadoActivo[] = ['DISPONIBLE', 'ASIGNADO', 'PRESTADO', 'MANTENIMIENTO'];

interface UseCategoriasActivosOptions {
  subtipoSalida?: SubtipoSalida;
  categoriasPermitidas?: number[];
  almacenId?: number;
}

interface ActivoConEstado extends Activos {
  esSeleccionable: boolean;
}

interface UseCategoriasActivosReturn {
  // Categorías
  categorias: Categorias[];
  categoriasLoading: boolean;
  categoriaSeleccionada: Categorias | null;
  selectCategoria: (categoria: Categorias | null) => void;

  // Activos
  activos: ActivoConEstado[];
  activosLoading: boolean;
  activosError: string | null;

  // Búsqueda
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Conteo por categoría
  getActivosCountByCategoria: (categoriaId: number) => number;

  // Helpers
  isEstadoSeleccionable: (estado: string | undefined) => boolean;
  refresh: () => Promise<void>;
}

export function useCategoriasActivos(
  options: UseCategoriasActivosOptions = {}
): UseCategoriasActivosReturn {
  const { subtipoSalida, categoriasPermitidas, almacenId } = options;

  // Estado de categorías
  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [categoriasLoading, setCategoriasLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categorias | null>(null);

  // Estado de activos
  const [todosLosActivos, setTodosLosActivos] = useState<Activos[]>([]);
  const [activos, setActivos] = useState<ActivoConEstado[]>([]);
  const [activosLoading, setActivosLoading] = useState(false);
  const [activosError, setActivosError] = useState<string | null>(null);

  // Búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Determinar si un estado es seleccionable según el subtipo
  const isEstadoSeleccionable = useCallback(
    (estado: string | undefined): boolean => {
      if (!estado) return false;
      if (!subtipoSalida) return estado === 'DISPONIBLE';

      const estadosPermitidos = ESTADOS_SELECCIONABLES_POR_SUBTIPO[subtipoSalida];
      return estadosPermitidos.includes(estado as EstadoActivo);
    },
    [subtipoSalida]
  );

  // Cargar categorías
  const loadCategorias = useCallback(async () => {
    setCategoriasLoading(true);
    try {
      let data = await categoriasService.getAll();

      // Filtrar por categorías permitidas si aplica
      if (categoriasPermitidas && categoriasPermitidas.length > 0) {
        data = data.filter((cat) => cat.id && categoriasPermitidas.includes(cat.id));
      }

      setCategorias(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setCategorias([]);
    } finally {
      setCategoriasLoading(false);
    }
  }, [categoriasPermitidas]);

  // Cargar todos los activos (para conteos)
  const loadTodosLosActivos = useCallback(async () => {
    try {
      let data = await activosService.getAll();

      // Filtrar por almacén si aplica
      if (almacenId) {
        data = data.filter((a) => a.almacen_id === almacenId);
      }

      // Filtrar solo estados visibles
      data = data.filter((a) =>
        a.estado_activo && ESTADOS_VISIBLES.includes(a.estado_activo as EstadoActivo)
      );

      setTodosLosActivos(data);
    } catch (err) {
      console.error('Error al cargar activos:', err);
      setTodosLosActivos([]);
    }
  }, [almacenId]);

  // Cargar activos de una categoría específica
  const loadActivosByCategoria = useCallback(
    async (categoriaId: number) => {
      setActivosLoading(true);
      setActivosError(null);

      try {
        const data = await activosService.getAll();

        // Filtrar por categoría
        let filtered = data.filter((a) => a.categoria_id === categoriaId);

        // Filtrar por almacén si aplica
        if (almacenId) {
          filtered = filtered.filter((a) => a.almacen_id === almacenId);
        }

        // Filtrar solo estados visibles
        filtered = filtered.filter((a) =>
          a.estado_activo && ESTADOS_VISIBLES.includes(a.estado_activo as EstadoActivo)
        );

        // Filtrar por término de búsqueda
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter((a) =>
            a.marca?.toLowerCase().includes(term) ||
            a.modelo?.toLowerCase().includes(term) ||
            a.codigo_inventario_local?.toLowerCase().includes(term) ||
            a.codigo_inventario_control_bienes?.toLowerCase().includes(term)
          );
        }

        // Agregar flag de seleccionable
        const activosConEstado: ActivoConEstado[] = filtered.map((activo) => ({
          ...activo,
          esSeleccionable: isEstadoSeleccionable(activo.estado_activo),
        }));

        // Ordenar: seleccionables primero
        activosConEstado.sort((a, b) => {
          if (a.esSeleccionable && !b.esSeleccionable) return -1;
          if (!a.esSeleccionable && b.esSeleccionable) return 1;
          return 0;
        });

        setActivos(activosConEstado);
      } catch (err) {
        setActivosError(err instanceof Error ? err.message : 'Error al cargar activos');
        setActivos([]);
      } finally {
        setActivosLoading(false);
      }
    },
    [almacenId, searchTerm, isEstadoSeleccionable]
  );

  // Seleccionar categoría
  const selectCategoria = useCallback(
    (categoria: Categorias | null) => {
      setCategoriaSeleccionada(categoria);
      if (categoria?.id) {
        loadActivosByCategoria(categoria.id);
      } else {
        setActivos([]);
      }
    },
    [loadActivosByCategoria]
  );

  // Obtener conteo de activos por categoría
  const getActivosCountByCategoria = useCallback(
    (categoriaId: number): number => {
      return todosLosActivos.filter((a) => a.categoria_id === categoriaId).length;
    },
    [todosLosActivos]
  );

  // Refresh
  const refresh = useCallback(async () => {
    await Promise.all([loadCategorias(), loadTodosLosActivos()]);
    if (categoriaSeleccionada?.id) {
      await loadActivosByCategoria(categoriaSeleccionada.id);
    }
  }, [loadCategorias, loadTodosLosActivos, categoriaSeleccionada, loadActivosByCategoria]);

  // Efectos iniciales
  useEffect(() => {
    loadCategorias();
    loadTodosLosActivos();
  }, [loadCategorias, loadTodosLosActivos]);

  // Recargar activos cuando cambia el término de búsqueda
  useEffect(() => {
    if (categoriaSeleccionada?.id) {
      const timer = setTimeout(() => {
        loadActivosByCategoria(categoriaSeleccionada.id!);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, categoriaSeleccionada, loadActivosByCategoria]);

  return {
    // Categorías
    categorias,
    categoriasLoading,
    categoriaSeleccionada,
    selectCategoria,

    // Activos
    activos,
    activosLoading,
    activosError,

    // Búsqueda
    searchTerm,
    setSearchTerm,

    // Conteo
    getActivosCountByCategoria,

    // Helpers
    isEstadoSeleccionable,
    refresh,
  };
}
