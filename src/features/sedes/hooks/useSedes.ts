import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as sedesService from '../sedes.service';
import type { Sedes, SedesCreateDTO, SedesUpdateDTO, PaginatedMeta } from '../sedes.types';

interface UseSedesOptions {
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

export function useSedes(options: UseSedesOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [sedes, setSedes] = useState<Sedes[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);


  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await sedesService.getPaginated({ page: newPage, limit: newLimit });
        setSedes(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await sedesService.getAll();
        setSedes(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching sedes:', error);
      toastx.error('Error al cargar Sedes');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: SedesCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await sedesService.create(data);
      toastx.success('Sedes creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating sedes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: SedesUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await sedesService.update(id, data);
      toastx.success('Sedes actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating sedes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await sedesService.remove(id);
      toastx.success('Sedes eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting sedes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    sedes,
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
