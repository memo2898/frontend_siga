import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as departamentosService from '../departamentos.service';
import type { Departamentos, DepartamentosCreateDTO, DepartamentosUpdateDTO, PaginatedMeta } from '../departamentos.types';
import * as direccionesService from '../../direcciones/direcciones.service';

interface UseDepartamentosOptions {
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

export function useDepartamentos(options: UseDepartamentosOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [departamentos, setDepartamentos] = useState<Departamentos[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);

  // Estados para opciones de foreign keys
  const [direccionesOptions, setDireccionesOptions] = useState<Array<{ value: number; label: string }>>([]);

  // Cargar opciones de foreign keys al montar
  useEffect(() => {
    const fetchRelatedOptions = async () => {
      try {
        const direccionesData = await direccionesService.getAll();
        const direccionesOpts = direccionesData.map((item: any) => ({
          value: Number(item.id),
          label: String(item.sede_id || item.nombre || `ID: ${item.id}`)
        }));
        setDireccionesOptions(direccionesOpts);
        console.log('✅ Opciones de Direcciones cargadas:', direccionesOpts.length);
      } catch (error) {
        console.error('❌ Error cargando opciones de Direcciones:', error);
        toastx.error('Error al cargar opciones de Direcciones');
      }
    };

    fetchRelatedOptions();
  }, []);

  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await departamentosService.getPaginated({ page: newPage, limit: newLimit });
        setDepartamentos(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await departamentosService.getAll();
        setDepartamentos(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching departamentos:', error);
      toastx.error('Error al cargar Departamentos');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: DepartamentosCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await departamentosService.create(data);
      toastx.success('Departamentos creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating departamentos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: DepartamentosUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await departamentosService.update(id, data);
      toastx.success('Departamentos actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating departamentos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await departamentosService.remove(id);
      toastx.success('Departamentos eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting departamentos:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    departamentos,
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
    direccionesOptions,
  };
}
