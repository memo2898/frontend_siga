import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as activosService from '../activos.service';
import type { Activos, ActivosCreateDTO, ActivosUpdateDTO, PaginatedMeta } from '../activos.types';
import * as categoriasService from '../../categorias/categorias.service';
import * as almacenesService from '../../almacenes/almacenes.service';

interface UseActivosOptions {
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

export function useActivos(options: UseActivosOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [activos, setActivos] = useState<Activos[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);

  // Estados para opciones de foreign keys
  const [categoriasOptions, setCategoriasOptions] = useState<Array<{ value: number; label: string }>>([]);
  const [almacenesOptions, setAlmacenesOptions] = useState<Array<{ value: number; label: string }>>([]);

  // Cargar opciones de foreign keys al montar
  useEffect(() => {
    const fetchRelatedOptions = async () => {
      try {
        const categoriasData = await categoriasService.getAll();
        const categoriasOpts = categoriasData.map((item: any) => ({
          value: Number(item.id),
          label: String(item.nombre || item.nombre || `ID: ${item.id}`)
        }));
        setCategoriasOptions(categoriasOpts);
        console.log('✅ Opciones de Categorias cargadas:', categoriasOpts.length);
      } catch (error) {
        console.error('❌ Error cargando opciones de Categorias:', error);
        toastx.error('Error al cargar opciones de Categorias');
      }
      try {
        const almacenesData = await almacenesService.getAll();
        const almacenesOpts = almacenesData.map((item: any) => ({
          value: Number(item.id),
          label: String(item.nombre || item.nombre || `ID: ${item.id}`)
        }));
        setAlmacenesOptions(almacenesOpts);
        console.log('✅ Opciones de Almacenes cargadas:', almacenesOpts.length);
      } catch (error) {
        console.error('❌ Error cargando opciones de Almacenes:', error);
        toastx.error('Error al cargar opciones de Almacenes');
      }
    };

    fetchRelatedOptions();
  }, []);

  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await activosService.getPaginated({ page: newPage, limit: newLimit });
        setActivos(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await activosService.getAll();
        setActivos(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching activos:', error);
      toastx.error('Error al cargar Activos');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: ActivosCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await activosService.create(data);
      toastx.success('Activos creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating activos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: ActivosUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await activosService.update(id, data);
      toastx.success('Activos actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating activos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await activosService.remove(id);
      toastx.success('Activos eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting activos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    activos,
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
    categoriasOptions,
    almacenesOptions,
  };
}
