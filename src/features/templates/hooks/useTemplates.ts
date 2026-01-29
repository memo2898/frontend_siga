import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as templatesService from '../templates.service';
import type { Templates, TemplatesCreateDTO, TemplatesUpdateDTO, PaginatedMeta } from '../templates.types';

interface UseTemplatesOptions {
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

export function useTemplates(options: UseTemplatesOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [templates, setTemplates] = useState<Templates[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);


  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await templatesService.getPaginated({ page: newPage, limit: newLimit });
        setTemplates(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await templatesService.getAll();
        setTemplates(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toastx.error('Error al cargar Templates');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: TemplatesCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await templatesService.create(data);
      toastx.success('Templates creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating templates:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: TemplatesUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await templatesService.update(id, data);
      toastx.success('Templates actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating templates:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await templatesService.remove(id);
      toastx.success('Templates eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting templates:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    templates,
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
