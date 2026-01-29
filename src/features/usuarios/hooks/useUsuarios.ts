import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as usuariosService from '../usuarios.service';
import type { Usuarios, UsuariosCreateDTO, UsuariosUpdateDTO, PaginatedMeta } from '../usuarios.types';

interface UseUsuariosOptions {
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

export function useUsuarios(options: UseUsuariosOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);


  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await usuariosService.getPaginated({ page: newPage, limit: newLimit });
        setUsuarios(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await usuariosService.getAll();
        setUsuarios(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      toastx.error('Error al cargar Usuarios');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: UsuariosCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await usuariosService.create(data);
      toastx.success('Usuarios creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating usuarios:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: UsuariosUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await usuariosService.update(id, data);
      toastx.success('Usuarios actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating usuarios:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await usuariosService.remove(id);
      toastx.success('Usuarios eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting usuarios:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };


  const cambiarPassword = async (id: number, nuevaPassword: string): Promise<boolean> => {
  setSaving(true);
  try {
    await usuariosService.cambiarPassword(id, nuevaPassword);
    toastx.success('Contraseña actualizada correctamente');
    await fetch();
    return true;
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    toastx.error(getErrorMessage(error));
    return false;
  } finally {
    setSaving(false);
  }
};


  return {
    usuarios,
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
    cambiarPassword
  };
}
