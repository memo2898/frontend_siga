import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as transaccionesService from '../transacciones.service';
import type { Transacciones, TransaccionesCreateDTO, TransaccionesUpdateDTO, PaginatedMeta } from '../transacciones.types';
import * as modulosService from '../../modulos/modulos.service';
import * as personasService from '../../personas/personas.service';
import * as usuariosService from '../../usuarios_/usuarios.service';
import * as rolesService from '../../roles/roles.service';

interface UseTransaccionesOptions {
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

export function useTransacciones(options: UseTransaccionesOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [transacciones, setTransacciones] = useState<Transacciones[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);

  // Estados para opciones de foreign keys
  const [modulosOptions, setModulosOptions] = useState<Array<{ value: number; label: string }>>([]);
  const [personasOptions, setPersonasOptions] = useState<Array<{ value: number; label: string }>>([]);
  const [usuariosOptions, setUsuariosOptions] = useState<Array<{ value: number; label: string }>>([]);
  const [rolesOptions, setRolesOptions] = useState<Array<{ value: number; label: string }>>([]);

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
        console.log('Opciones de Modulos cargadas:', modulosOpts.length);
      } catch (error) {
        console.error('❌ Error cargando opciones de Modulos:', error);
        toastx.error('Error al cargar opciones de Modulos');
      }
      try {
        const personasData = await personasService.getAll();
        const personasOpts = personasData.map((item: any) => ({
          value: Number(item.id),
          label: String(item.nombre || item.nombre || `ID: ${item.id}`)
        }));
        setPersonasOptions(personasOpts);
        console.log('Opciones de Personas cargadas:', personasOpts.length);
      } catch (error) {
        console.error('❌ Error cargando opciones de Personas:', error);
        toastx.error('Error al cargar opciones de Personas');
      }
      try {
        const usuariosData = await usuariosService.getAll();
        const usuariosOpts = usuariosData.map((item: any) => ({
          value: Number(item.id),
          label: String(item.nombre || item.nombre || `ID: ${item.id}`)
        }));
        setUsuariosOptions(usuariosOpts);
        console.log('Opciones de Usuarios cargadas:', usuariosOpts.length);
      } catch (error) {
        console.error('❌ Error cargando opciones de Usuarios:', error);
        toastx.error('Error al cargar opciones de Usuarios');
      }
      try {
        const rolesData = await rolesService.getAll();
        const rolesOpts = rolesData.map((item: any) => ({
          value: Number(item.id),
          label: String(item.nombre || item.nombre || `ID: ${item.id}`)
        }));
        setRolesOptions(rolesOpts);
        console.log('Opciones de Roles cargadas:', rolesOpts.length);
      } catch (error) {
        console.error('❌ Error cargando opciones de Roles:', error);
        toastx.error('Error al cargar opciones de Roles');
      }
    };

    fetchRelatedOptions();
  }, []);

  const fetch = useCallback(async (newPage = page, newLimit = limit) => {
    setLoading(true);
    try {
      if (paginated) {
        const response = await transaccionesService.getPaginated({ page: newPage, limit: newLimit });
        setTransacciones(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await transaccionesService.getAll();
        setTransacciones(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching transacciones:', error);
      toastx.error('Error al cargar Transacciones');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: TransaccionesCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await transaccionesService.create(data);
      toastx.success('Transacciones creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating transacciones:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: TransaccionesUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await transaccionesService.update(id, data);
      toastx.success('Transacciones actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating transacciones:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await transaccionesService.remove(id);
      toastx.success('Transacciones eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting transacciones:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    transacciones,
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
    personasOptions,
    usuariosOptions,
    rolesOptions,
  };
}
