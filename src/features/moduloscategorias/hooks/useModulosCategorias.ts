import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as modulosCategoriasService from '../moduloscategorias.service';
import type { ModulosCategorias, ModulosCategoriasCreateDTO, ModulosCategoriasUpdateDTO, PaginatedMeta } from '../moduloscategorias.types';
import * as modulosService from '../../modulos/modulos.service';
import * as categoriasService from '../../categorias/categorias.service';

interface UseModulosCategoriasOptions {
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

export function useModulosCategorias(options: UseModulosCategoriasOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [modulosCategorias, setModulosCategorias] = useState<ModulosCategorias[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);

  // Estados para opciones de foreign keys
  const [modulosOptions, setModulosOptions] = useState<Array<{ value: number; label: string }>>([]);
  const [categoriasOptions, setCategoriasOptions] = useState<Array<{ value: number; label: string }>>([]);

  // Cargar opciones de foreign keys al montar
  useEffect(() => {
    const fetchRelatedOptions = async () => {
      try {
        const modulosData = await modulosService.getAll();
        const modulosOpts = modulosData.map((item: any) => ({
          value: Number(item.id),
          label: String(item.nombre || item.nombre || `ID: ${item.id}`)
        }));
        setModulosOptions(modulosOpts);
        console.log('✅ Opciones de Modulos cargadas:', modulosOpts.length);
      } catch (error) {
        console.error('❌ Error cargando opciones de Modulos:', error);
        toastx.error('Error al cargar opciones de Modulos');
      }
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
    };

    fetchRelatedOptions();
  }, []);

  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await modulosCategoriasService.getPaginated({ page: newPage, limit: newLimit });
        setModulosCategorias(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await modulosCategoriasService.getAll();
        setModulosCategorias(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching modulosCategorias:', error);
      toastx.error('Error al cargar ModulosCategorias');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: ModulosCategoriasCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await modulosCategoriasService.create(data);
      toastx.success('ModulosCategorias creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating modulosCategorias:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: ModulosCategoriasUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await modulosCategoriasService.update(id, data);
      toastx.success('ModulosCategorias actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating modulosCategorias:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await modulosCategoriasService.remove(id);
      toastx.success('ModulosCategorias eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting modulosCategorias:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    modulosCategorias,
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
    modulosOptions,
    categoriasOptions,
  };
}
