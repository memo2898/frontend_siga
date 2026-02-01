import { useState, useCallback, useRef, useEffect } from 'react';
import type { Personas, PersonasFilters } from '../../../personas/personas.types';
import * as personasService from '../../../personas/personas.service';

interface UsePersonaBusquedaReturn {
  personas: Personas[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  buscarPorDocumento: (numeroDocumento: string) => Promise<Personas[]>;
  buscarPorNombre: (nombre: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearResults: () => void;
}

export function usePersonaBusqueda(): UsePersonaBusquedaReturn {
  const [personas, setPersonas] = useState<Personas[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const buscarPorDocumento = useCallback(
    async (numeroDocumento: string): Promise<Personas[]> => {
      if (!numeroDocumento || numeroDocumento.trim() === '') {
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        const filters: PersonasFilters = {
          numero_documento: numeroDocumento.trim(),
          limit: 10,
        };
        const response = await personasService.getPaginated(filters);
        setPersonas(response.data);
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al buscar persona');
        setPersonas([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const buscarPorNombre = useCallback(async (nombre: string): Promise<void> => {
    if (!nombre || nombre.trim().length < 3) {
      setPersonas([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const filters: PersonasFilters = {
        nombre: nombre.trim(),
        limit: 10,
      };
      const response = await personasService.getPaginated(filters);
      setPersonas(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar persona');
      setPersonas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (searchTerm) {
      await buscarPorNombre(searchTerm);
    }
  }, [searchTerm, buscarPorNombre]);

  const clearResults = useCallback(() => {
    setPersonas([]);
    setSearchTerm('');
    setError(null);
  }, []);

  // Debounce search term changes
  const handleSearchTermChange = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (term.length >= 3) {
        debounceRef.current = setTimeout(() => {
          buscarPorNombre(term);
        }, 300);
      } else {
        setPersonas([]);
      }
    },
    [buscarPorNombre]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    personas,
    loading,
    error,
    searchTerm,
    setSearchTerm: handleSearchTermChange,
    buscarPorDocumento,
    buscarPorNombre,
    refresh,
    clearResults,
  };
}
