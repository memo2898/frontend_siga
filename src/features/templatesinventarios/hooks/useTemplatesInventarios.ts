import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as templatesInventariosService from '../templatesinventarios.service';
import type { TemplatesInventarios, TemplatesInventariosCreateDTO, TemplatesInventariosUpdateDTO, PaginatedMeta } from '../templatesinventarios.types';

interface UseTemplatesInventariosOptions {
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

export function useTemplatesInventarios(options: UseTemplatesInventariosOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [templatesInventarios, setTemplatesInventarios] = useState<TemplatesInventarios[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);


  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await templatesInventariosService.getPaginated({ page: newPage, limit: newLimit });
        setTemplatesInventarios(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await templatesInventariosService.getAll();
        setTemplatesInventarios(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching templatesInventarios:', error);
      toastx.error('Error al cargar TemplatesInventarios');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: TemplatesInventariosCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await templatesInventariosService.create(data);
      toastx.success('TemplatesInventarios creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating templatesInventarios:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: TemplatesInventariosUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await templatesInventariosService.update(id, data);
      toastx.success('TemplatesInventarios actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating templatesInventarios:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await templatesInventariosService.remove(id);
      toastx.success('TemplatesInventarios eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting templatesInventarios:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    templatesInventarios,
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
