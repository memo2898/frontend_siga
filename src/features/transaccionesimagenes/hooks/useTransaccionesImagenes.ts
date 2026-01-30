import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as transaccionesImagenesService from '../transaccionesimagenes.service';
import type { TransaccionesImagenes, TransaccionesImagenesCreateDTO, TransaccionesImagenesUpdateDTO, PaginatedMeta } from '../transaccionesimagenes.types';
import * as transaccionesService from '../../transacciones/transacciones.service';
import * as activosService from '../../activos/activos.service';

interface UseTransaccionesImagenesOptions {
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

export function useTransaccionesImagenes(options: UseTransaccionesImagenesOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [transaccionesImagenes, setTransaccionesImagenes] = useState<TransaccionesImagenes[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);

  // Estados para opciones de foreign keys
  const [transaccionesOptions, setTransaccionesOptions] = useState<Array<{ value: number; label: string }>>([]);
  const [activosOptions, setActivosOptions] = useState<Array<{ value: number; label: string }>>([]);

  // Cargar opciones de foreign keys al montar
  useEffect(() => {
    const fetchRelatedOptions = async () => {
      try {
        const transaccionesData = await transaccionesService.getAll();
        const transaccionesOpts = transaccionesData.map((item: any) => ({
          value: Number(item.id),
          label: String(item.codigo || item.nombre || `ID: ${item.id}`)
        }));
        setTransaccionesOptions(transaccionesOpts);
        console.log('Opciones de Transacciones cargadas:', transaccionesOpts.length);
      } catch (error) {
        console.error('❌ Error cargando opciones de Transacciones:', error);
        toastx.error('Error al cargar opciones de Transacciones');
      }
      try {
        const activosData = await activosService.getAll();
        const activosOpts = activosData.map((item: any) => ({
          value: Number(item.id),
          label: String(item.codigo_inventario_local || item.nombre || `ID: ${item.id}`)
        }));
        setActivosOptions(activosOpts);
        console.log('Opciones de Activos cargadas:', activosOpts.length);
      } catch (error) {
        console.error('❌ Error cargando opciones de Activos:', error);
        toastx.error('Error al cargar opciones de Activos');
      }
    };

    fetchRelatedOptions();
  }, []);

  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await transaccionesImagenesService.getPaginated({ page: newPage, limit: newLimit });
        setTransaccionesImagenes(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await transaccionesImagenesService.getAll();
        setTransaccionesImagenes(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching transaccionesImagenes:', error);
      toastx.error('Error al cargar TransaccionesImagenes');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: TransaccionesImagenesCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await transaccionesImagenesService.create(data);
      toastx.success('TransaccionesImagenes creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating transaccionesImagenes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: TransaccionesImagenesUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await transaccionesImagenesService.update(id, data);
      toastx.success('TransaccionesImagenes actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating transaccionesImagenes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await transaccionesImagenesService.remove(id);
      toastx.success('TransaccionesImagenes eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting transaccionesImagenes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    transaccionesImagenes,
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
    // Opciones de foreign keys
    transaccionesOptions,
    activosOptions,
  };
}
