import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as templatesModulosService from '../templatesmodulos.service';
import type { TemplatesModulos, TemplatesModulosCreateDTO, TemplatesModulosUpdateDTO, PaginatedMeta } from '../templatesmodulos.types';

interface UseTemplatesModulosOptions {
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

export function useTemplatesModulos(options: UseTemplatesModulosOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [templatesModulos, setTemplatesModulos] = useState<TemplatesModulos[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);


  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await templatesModulosService.getPaginated({ page: newPage, limit: newLimit });
        setTemplatesModulos(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await templatesModulosService.getAll();
        setTemplatesModulos(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching templatesModulos:', error);
      toastx.error('Error al cargar TemplatesModulos');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: TemplatesModulosCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await templatesModulosService.create(data);
      toastx.success('TemplatesModulos creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating templatesModulos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: TemplatesModulosUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await templatesModulosService.update(id, data);
      toastx.success('TemplatesModulos actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating templatesModulos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await templatesModulosService.remove(id);
      toastx.success('TemplatesModulos eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting templatesModulos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    templatesModulos,
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
