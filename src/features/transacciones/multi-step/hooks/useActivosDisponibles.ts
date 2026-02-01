import { useState, useCallback, useRef, useEffect } from 'react';
import type { Activos, ActivosFilters } from '../../../activos/activos.types';
import * as activosService from '../../../activos/activos.service';

interface UseActivosDisponiblesOptions {
  categoriaId?: number;
  almacenId?: number;
  soloDisponibles?: boolean;
  categoriasPermitidas?: number[];
}

interface UseActivosDisponiblesReturn {
  activos: Activos[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  search: (term?: string) => Promise<void>;
  refresh: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useActivosDisponibles(
  options: UseActivosDisponiblesOptions = {}
): UseActivosDisponiblesReturn {
  const {
    categoriaId,
    almacenId,
    soloDisponibles = true,
    categoriasPermitidas,
  } = options;

  const [activos, setActivos] = useState<Activos[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const buildFilters = useCallback(
    (term: string, pageNum: number): ActivosFilters => {
      const filters: ActivosFilters = {
        page: pageNum,
        limit: 20,
      };

      if (categoriaId) {
        filters.categoria_id = categoriaId;
      }

      if (almacenId) {
        filters.almacen_id = almacenId;
      }

      if (soloDisponibles) {
        filters.estado_activo = 'DISPONIBLE';
      }

      // Si hay termino de busqueda, buscar por codigo o marca
      if (term) {
        // El servicio deberia soportar busqueda por codigo_inventario_local o marca
        filters.codigo_inventario_local = term;
      }

      return filters;
    },
    [categoriaId, almacenId, soloDisponibles]
  );

  const search = useCallback(
    async (term?: string) => {
      const searchValue = term !== undefined ? term : searchTerm;
      setLoading(true);
      setError(null);
      setPage(1);

      try {
        const filters = buildFilters(searchValue, 1);
        const response = await activosService.getPaginated(filters);

        // Filtrar por categorias permitidas si aplica
        let data = response.data;
        if (categoriasPermitidas && categoriasPermitidas.length > 0) {
          data = data.filter(
            (a) => a.categoria_id && categoriasPermitidas.includes(a.categoria_id)
          );
        }

        setActivos(data);
        setHasMore(response.meta.hasNext);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al buscar activos');
        setActivos([]);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, buildFilters, categoriasPermitidas]
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const filters = buildFilters(searchTerm, nextPage);
      const response = await activosService.getPaginated(filters);

      let data = response.data;
      if (categoriasPermitidas && categoriasPermitidas.length > 0) {
        data = data.filter(
          (a) => a.categoria_id && categoriasPermitidas.includes(a.categoria_id)
        );
      }

      setActivos((prev) => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(response.meta.hasNext);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mas activos');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, searchTerm, buildFilters, categoriasPermitidas]);

  const refresh = useCallback(async () => {
    await search(searchTerm);
  }, [search, searchTerm]);

  // Debounce search term changes
  const handleSearchTermChange = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        search(term);
      }, 300);
    },
    [search]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Initial load
  useEffect(() => {
    search('');
  }, []);

  return {
    activos,
    loading,
    error,
    searchTerm,
    setSearchTerm: handleSearchTermChange,
    search,
    refresh,
    hasMore,
    loadMore,
  };
}
