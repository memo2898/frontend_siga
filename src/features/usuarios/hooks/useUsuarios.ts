import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as usuariosService from '../usuarios.service';
import type { Usuarios, UsuariosCreateDTO, UsuariosUpdateDTO, PaginatedMeta } from '../usuarios.types';
import * as departamentosService from '../../departamentos/departamentos.service';

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

  // Estados para opciones de foreign keys
  const [departamentosOptions, setDepartamentosOptions] = useState<Array<{ value: number; label: string }>>([]);

  // Cargar opciones de foreign keys al montar
  useEffect(() => {
    const fetchRelatedOptions = async () => {
      try {
        const departamentosData = await departamentosService.getAll();
        const departamentosOpts = departamentosData.map((item: any) => ({
          value: Number(item.id),
          label: String(item.direccion_id || item.nombre || `ID: ${item.id}`)
        }));
        setDepartamentosOptions(departamentosOpts);
        console.log('✅ Opciones de Departamentos cargadas:', departamentosOpts.length);
      } catch (error) {
        console.error('❌ Error cargando opciones de Departamentos:', error);
        toastx.error('Error al cargar opciones de Departamentos');
      }
    };

    fetchRelatedOptions();
  }, []);

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
    // Opciones de foreign keys
    departamentosOptions,
  };
}
