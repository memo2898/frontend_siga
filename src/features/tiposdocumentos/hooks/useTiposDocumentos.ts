import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as tiposDocumentosService from '../tiposdocumentos.service';
import type { TiposDocumentos, TiposDocumentosCreateDTO, TiposDocumentosUpdateDTO, PaginatedMeta } from '../tiposdocumentos.types';

interface UseTiposDocumentosOptions {
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

export function useTiposDocumentos(options: UseTiposDocumentosOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [tiposDocumentos, setTiposDocumentos] = useState<TiposDocumentos[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);


  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await tiposDocumentosService.getPaginated({ page: newPage, limit: newLimit });
        setTiposDocumentos(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await tiposDocumentosService.getAll();
        setTiposDocumentos(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching tiposDocumentos:', error);
      toastx.error('Error al cargar TiposDocumentos');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: TiposDocumentosCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await tiposDocumentosService.create(data);
      toastx.success('TiposDocumentos creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating tiposDocumentos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: TiposDocumentosUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await tiposDocumentosService.update(id, data);
      toastx.success('TiposDocumentos actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating tiposDocumentos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await tiposDocumentosService.remove(id);
      toastx.success('TiposDocumentos eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting tiposDocumentos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    tiposDocumentos,
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
