import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as almacenesService from '../almacenes.service';
import type { AlmacenesDetalleResponse, AlmacenesDetalleFilters } from '../almacenes.types';

interface UseAlmacenDetalleOptions {
  autoFetch?: boolean;
  defaultFilters?: AlmacenesDetalleFilters;
}

export function useAlmacenDetalle(options: UseAlmacenDetalleOptions = {}) {
  const { autoFetch = true, defaultFilters = {} } = options;
  const { id } = useParams<{ id: string }>();

  const [detalle, setDetalle] = useState<AlmacenesDetalleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AlmacenesDetalleFilters>(defaultFilters);

  const fetch = useCallback(async (newFilters?: AlmacenesDetalleFilters) => {
    if (!id) {
      setError('ID de almacén no proporcionado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await almacenesService.getDetalle(
        Number(id),
        newFilters || filters
      );
      setDetalle(response);
      if (newFilters) {
        setFilters(newFilters);
      }
    } catch (err) {
      console.error('Error fetching almacen detalle:', err);
      const message = err instanceof Error ? err.message : 'Error al cargar el detalle del almacén';
      setError(message);
      toastx.error(message);
    } finally {
      setLoading(false);
    }
  }, [id, filters]);

  useEffect(() => {
    if (autoFetch && id) {
      fetch();
    }
  }, [autoFetch, id]);

  const refetch = useCallback((newFilters?: AlmacenesDetalleFilters) => {
    return fetch(newFilters);
  }, [fetch]);

  return {
    id: id ? Number(id) : null,
    detalle,
    loading,
    error,
    filters,
    fetch: refetch,
    setFilters,
  };
}
