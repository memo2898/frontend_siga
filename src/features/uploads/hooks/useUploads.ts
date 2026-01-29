import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as uploadsService from '../uploads.service';
import type { Uploads, UploadsCreateDTO, UploadsUpdateDTO, PaginatedMeta } from '../uploads.types';

interface UseUploadsOptions {
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

export function useUploads(options: UseUploadsOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [uploads, setUploads] = useState<Uploads[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);


  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await uploadsService.getPaginated({ page: newPage, limit: newLimit });
        setUploads(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await uploadsService.getAll();
        setUploads(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching uploads:', error);
      toastx.error('Error al cargar Uploads');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: UploadsCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await uploadsService.create(data);
      toastx.success('Uploads creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating uploads:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: UploadsUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await uploadsService.update(id, data);
      toastx.success('Uploads actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating uploads:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await uploadsService.remove(id);
      toastx.success('Uploads eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting uploads:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    uploads,
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
