import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as modulosService from '../modulos.service';
import type { Modulos, ModulosCreateDTO, ModulosUpdateDTO, PaginatedMeta } from '../modulos.types';

interface UseModulosOptions {
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

export function useModulos(options: UseModulosOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [modulos, setModulos] = useState<Modulos[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);


  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await modulosService.getPaginated({ page: newPage, limit: newLimit });
        setModulos(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await modulosService.getAll();
        setModulos(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching modulos:', error);
      toastx.error('Error al cargar Modulos');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: ModulosCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await modulosService.create(data);
      toastx.success('Modulos creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating modulos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: ModulosUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await modulosService.update(id, data);
      toastx.success('Modulos actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating modulos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await modulosService.remove(id);
      toastx.success('Modulos eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting modulos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    modulos,
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
  };
}
