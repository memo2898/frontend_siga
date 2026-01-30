import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as personasService from '../personas.service';
import type { Personas, PersonasCreateDTO, PersonasUpdateDTO, PaginatedMeta } from '../personas.types';
import * as departamentosService from '../../departamentos/departamentos.service';

interface UsePersonasOptions {
  paginated?: boolean;
  defaultLimit?: number;
}

// Helper para extraer mensaje de error
const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: string | string[] }).message;
    if (Array.isArray(msg)) {
      return msg.join(', ');
    }
    return msg;
  }
  return 'Error desconocido';
};

export function usePersonas(options: UsePersonasOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [personas, setPersonas] = useState<Personas[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);

  // Estados para opciones de foreign keys
  const [departamentosOptions, setDepartamentosOptions] = useState<Array<{ value: number; label: string }>>([]);

  // Cargar opciones de foreign keys al montar
  useEffect(() => {
    const fetchRelatedOptions = async () => {
      try {
        const departamentosData = await departamentosService.getAll();
        const departamentosOpts = departamentosData.map((item: any) => ({
          value: Number(item.id),
          label: String(item.direccion_id || item.nombre || `ID: ${item.id}`)
        }));
        setDepartamentosOptions(departamentosOpts);
        console.log('Opciones de Departamentos cargadas:', departamentosOpts.length);
      } catch (error) {
        console.error('❌ Error cargando opciones de Departamentos:', error);
        toastx.error('Error al cargar opciones de Departamentos');
      }
    };

    fetchRelatedOptions();
  }, []);

  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await personasService.getPaginated({ page: newPage, limit: newLimit });
        setPersonas(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await personasService.getAll();
        setPersonas(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching personas:', error);
      toastx.error('Error al cargar Personas');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: PersonasCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await personasService.create(data);
      toastx.success('Personas creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating personas:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: PersonasUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await personasService.update(id, data);
      toastx.success('Personas actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating personas:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await personasService.remove(id);
      toastx.success('Personas eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting personas:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    personas,
    meta,
    loading,
    saving,
    page,
    limit,
    paginated,
    fetch,
    create,
    update,
    remove,
    // Opciones de foreign keys
    departamentosOptions,
  };
}
