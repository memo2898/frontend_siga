import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as authService from '../auth.service';
import type { Auth, AuthCreateDTO, AuthUpdateDTO, PaginatedMeta } from '../auth.types';

interface UseAuthOptions {
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

export function useAuth(options: UseAuthOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [auths, setAuths] = useState<Auth[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);


  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await authService.getPaginated({ page: newPage, limit: newLimit });
        setAuths(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await authService.getAll();
        setAuths(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching auths:', error);
      toastx.error('Error al cargar Auths');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: AuthCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await authService.create(data);
      toastx.success('Auth creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating auth:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: AuthUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await authService.update(id, data);
      toastx.success('Auth actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating auth:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await authService.remove(id);
      toastx.success('Auth eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting auth:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    auths,
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
