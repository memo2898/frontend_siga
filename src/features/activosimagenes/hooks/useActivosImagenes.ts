import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as activosImagenesService from '../activosimagenes.service';
import type { ActivosImagenes, ActivosImagenesCreateDTO, ActivosImagenesUpdateDTO, PaginatedMeta } from '../activosimagenes.types';
import * as activosService from '../../activos/activos.service';

interface UseActivosImagenesOptions {
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

export function useActivosImagenes(options: UseActivosImagenesOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [activosImagenes, setActivosImagenes] = useState<ActivosImagenes[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);

  // Estados para opciones de foreign keys
  const [activosOptions, setActivosOptions] = useState<Array<{ value: number; label: string }>>([]);

  // Cargar opciones de foreign keys al montar
  useEffect(() => {
    const fetchRelatedOptions = async () => {
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
        const response = await activosImagenesService.getPaginated({ page: newPage, limit: newLimit });
        setActivosImagenes(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await activosImagenesService.getAll();
        setActivosImagenes(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching activosImagenes:', error);
      toastx.error('Error al cargar ActivosImagenes');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: ActivosImagenesCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await activosImagenesService.create(data);
      toastx.success('ActivosImagenes creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating activosImagenes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: ActivosImagenesUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await activosImagenesService.update(id, data);
      toastx.success('ActivosImagenes actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating activosImagenes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await activosImagenesService.remove(id);
      toastx.success('ActivosImagenes eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting activosImagenes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    activosImagenes,
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
    activosOptions,
  };
}
