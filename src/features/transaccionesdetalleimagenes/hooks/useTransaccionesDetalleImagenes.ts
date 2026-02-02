import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as transaccionesDetalleImagenesService from '../transaccionesdetalleimagenes.service';
import type { TransaccionesDetalleImagenes, TransaccionesDetalleImagenesCreateDTO, TransaccionesDetalleImagenesUpdateDTO, PaginatedMeta } from '../transaccionesdetalleimagenes.types';

interface UseTransaccionesDetalleImagenesOptions {
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

export function useTransaccionesDetalleImagenes(options: UseTransaccionesDetalleImagenesOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [transaccionesDetalleImagenes, setTransaccionesDetalleImagenes] = useState<TransaccionesDetalleImagenes[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);


  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await transaccionesDetalleImagenesService.getPaginated({ page: newPage, limit: newLimit });
        setTransaccionesDetalleImagenes(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await transaccionesDetalleImagenesService.getAll();
        setTransaccionesDetalleImagenes(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching transaccionesDetalleImagenes:', error);
      toastx.error('Error al cargar TransaccionesDetalleImagenes');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: TransaccionesDetalleImagenesCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await transaccionesDetalleImagenesService.create(data);
      toastx.success('TransaccionesDetalleImagenes creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating transaccionesDetalleImagenes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: TransaccionesDetalleImagenesUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await transaccionesDetalleImagenesService.update(id, data);
      toastx.success('TransaccionesDetalleImagenes actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating transaccionesDetalleImagenes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await transaccionesDetalleImagenesService.remove(id);
      toastx.success('TransaccionesDetalleImagenes eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting transaccionesDetalleImagenes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    transaccionesDetalleImagenes,
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
