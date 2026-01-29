import { useState, useCallback, useEffect } from 'react';
import { toastx } from '../../../lib/uiX/components/ToastX';
import * as usuariosRolesService from '../usuariosroles.service';
import type { UsuariosRoles, UsuariosRolesCreateDTO, UsuariosRolesUpdateDTO, PaginatedMeta } from '../usuariosroles.types';
import * as usuariosService from '../../usuarios/usuarios.service';
import * as rolesService from '../../roles/roles.service';

interface UseUsuariosRolesOptions {
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

export function useUsuariosRoles(options: UseUsuariosRolesOptions = {}) {
  const { paginated = false, defaultLimit = 10 } = options;

  const [usuariosRoles, setUsuariosRoles] = useState<UsuariosRoles[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);

  // Estados para opciones de foreign keys
  const [usuariosOptions, setUsuariosOptions] = useState<Array<{ value: number; label: string }>>([]);
  const [rolesOptions, setRolesOptions] = useState<Array<{ value: number; label: string }>>([]);

  // Cargar opciones de foreign keys al montar
  useEffect(() => {
    const fetchRelatedOptions = async () => {
      try {
        const usuariosData = await usuariosService.getAll();
        const usuariosOpts = usuariosData.map((item: any) => ({
          value: Number(item.id),
          label: String(item.nombre || item.nombre || `ID: ${item.id}`)
        }));
        setUsuariosOptions(usuariosOpts);
        console.log('✅ Opciones de Usuarios cargadas:', usuariosOpts.length);
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
        console.log('✅ Opciones de Roles cargadas:', rolesOpts.length);
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
        const response = await usuariosRolesService.getPaginated({ page: newPage, limit: newLimit });
        setUsuariosRoles(response.data);
        setMeta(response.meta);
        setPage(newPage);
        setLimit(newLimit);
      } else {
        const response = await usuariosRolesService.getAll();
        setUsuariosRoles(response);
        setMeta(null);
      }
    } catch (error) {
      console.error('Error fetching usuariosRoles:', error);
      toastx.error('Error al cargar UsuariosRoles');
    } finally {
      setLoading(false);
    }
  }, [paginated, page, limit]);

  const create = async (data: UsuariosRolesCreateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await usuariosRolesService.create(data);
      toastx.success('UsuariosRoles creado correctamente');
      await fetch(paginated ? 1 : page, limit);
      return true;
    } catch (error) {
      console.error('Error creating usuariosRoles:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, data: UsuariosRolesUpdateDTO): Promise<boolean> => {
    setSaving(true);
    try {
      await usuariosRolesService.update(id, data);
      toastx.success('UsuariosRoles actualizado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error updating usuariosRoles:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setSaving(true);
    try {
      await usuariosRolesService.remove(id);
      toastx.success('UsuariosRoles eliminado correctamente');
      await fetch();
      return true;
    } catch (error) {
      console.error('Error deleting usuariosRoles:', error);
      toastx.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    usuariosRoles,
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
    usuariosOptions,
    rolesOptions,
  };
}
