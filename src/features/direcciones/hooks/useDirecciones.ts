import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as direccionesService from '../direcciones.service';
import type { Direcciones, DireccionesCreateDTO, DireccionesUpdateDTO, PaginatedMeta } from '../direcciones.types';
import * as sedesService from '../../sedes/sedes.service';

interface UseDireccionesOptions {
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

export function useDirecciones(options: UseDireccionesOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [direcciones, setDirecciones] = useState<Direcciones[]>([]);
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
        console.log('✅ Opciones de Sedes cargadas:', sedesOpts.length);
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
        const response = await direccionesService.getPaginated({ page: newPage, limit: newLimit });
        setDirecciones(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await direccionesService.getAll();
        setDirecciones(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching direcciones:', error);
      toastx.error('Error al cargar Direcciones');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: DireccionesCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await direccionesService.create(data);
      toastx.success('Direcciones creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating direcciones:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: DireccionesUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await direccionesService.update(id, data);
      toastx.success('Direcciones actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating direcciones:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await direccionesService.remove(id);
      toastx.success('Direcciones eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting direcciones:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    direcciones,
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
