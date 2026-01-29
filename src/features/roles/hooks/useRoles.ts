import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as rolesService from '../roles.service';
import type { Roles, RolesCreateDTO, RolesUpdateDTO, PaginatedMeta } from '../roles.types';

interface UseRolesOptions {
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

export function useRoles(options: UseRolesOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [roles, setRoles] = useState<Roles[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);


  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await rolesService.getPaginated({ page: newPage, limit: newLimit });
        setRoles(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await rolesService.getAll();
        setRoles(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toastx.error('Error al cargar Roles');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: RolesCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await rolesService.create(data);
      toastx.success('Roles creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating roles:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: RolesUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await rolesService.update(id, data);
      toastx.success('Roles actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating roles:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await rolesService.remove(id);
      toastx.success('Roles eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting roles:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    roles,
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
