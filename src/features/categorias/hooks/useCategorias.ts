import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as categoriasService from '../categorias.service';
import type { Categorias, CategoriasCreateDTO, CategoriasUpdateDTO, PaginatedMeta } from '../categorias.types';

interface UseCategoriasOptions {
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

export function useCategorias(options: UseCategoriasOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);


  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await categoriasService.getPaginated({ page: newPage, limit: newLimit });
        setCategorias(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await categoriasService.getAll();
        setCategorias(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching categorias:', error);
      toastx.error('Error al cargar Categorias');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: CategoriasCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await categoriasService.create(data);
      toastx.success('Categorias creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating categorias:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: CategoriasUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await categoriasService.update(id, data);
      toastx.success('Categorias actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating categorias:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await categoriasService.remove(id);
      toastx.success('Categorias eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting categorias:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    categorias,
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
