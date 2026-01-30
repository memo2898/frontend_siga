import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as almacenesService from '../almacenes.service';
import type { Almacenes, AlmacenesCreateDTO, AlmacenesUpdateDTO, PaginatedMeta } from '../almacenes.types';
import * as sedesService from '../../sedes/sedes.service';

interface UseAlmacenesOptions {
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

export function useAlmacenes(options: UseAlmacenesOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [almacenes, setAlmacenes] = useState<Almacenes[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);

  // Estados para opciones de foreign keys
  const [sedesOptions, setSedesOptions] = useState<Array<{ value: number; label: string }>>([]);

  // Cargar opciones de foreign keys al montar
  useEffect(() => {
    const fetchRelatedOptions = async () => {
      try {
        const sedesData = await sedesService.getAll();
        const sedesOpts = sedesData.map((item: any) => ({
          value: Number(item.id),
          label: String(item.nombre || item.nombre || `ID: ${item.id}`)
        }));
        setSedesOptions(sedesOpts);
        console.log('Opciones de Sedes cargadas:', sedesOpts.length);
      } catch (error) {
        console.error('❌ Error cargando opciones de Sedes:', error);
        toastx.error('Error al cargar opciones de Sedes');
      }
    };

    fetchRelatedOptions();
  }, []);

  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await almacenesService.getPaginated({ page: newPage, limit: newLimit });
        setAlmacenes(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await almacenesService.getAll();
        setAlmacenes(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching almacenes:', error);
      toastx.error('Error al cargar Almacenes');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: AlmacenesCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await almacenesService.create(data);
      toastx.success('Almacenes creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating almacenes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: AlmacenesUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await almacenesService.update(id, data);
      toastx.success('Almacenes actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating almacenes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await almacenesService.remove(id);
      toastx.success('Almacenes eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting almacenes:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    almacenes,
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
    sedesOptions,
  };
}
