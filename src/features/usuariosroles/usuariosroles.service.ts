import { http } from '../../http';
import { SERVER_ROUTE } from '../../config';
import type { UsuariosRoles, UsuariosRolesCreateDTO, UsuariosRolesUpdateDTO, UsuariosRolesFilters, PaginatedResponse } from './usuariosroles.types';

const BASE = `${SERVER_ROUTE}/api/usuarios-roles`;

// Configuración del tipo de borrado (soft delete por defecto)
const IS_SOFT_DELETE = true;

// Estados que se excluyen por defecto en las consultas
const EXCLUDED_STATES: string[] = ['ELIMINADO', 'DELETED', 'BORRADO', 'INACTIVO', 'DESHABILITADO', 'SUSPENDIDO'];

export const getAll = async () => {
  const response = await http.get<UsuariosRoles[]>(BASE);
  
  const data = response.filter(element => 
    !EXCLUDED_STATES.includes(element.estado as string)
  );
  
  return data;
};

export const getById = async (id: number) => {
  return await http.get<UsuariosRoles>(`${BASE}/${id}`);
};

export const create = async (data: UsuariosRolesCreateDTO) => {
  const payload = {
    ...data,
    estado: 'ACTIVO',
    agregado_en: new Date().toISOString(),
  };
  return await http.post<UsuariosRoles>(BASE, payload);
};

export const update = async (id: number, data: UsuariosRolesUpdateDTO) => {
  const payload = {
    ...data,
    actualizado_en: new Date().toISOString(),
  };
  return await http.patch<UsuariosRoles>(`${BASE}/${id}`, payload);
};

export const remove = async (id: number, softDelete = IS_SOFT_DELETE) => {
  if (softDelete) {
    // Soft delete: cambiamos el estado a ELIMINADO
    return await http.patch<void>(`${BASE}/${id}`, {
      estado: 'ELIMINADO',
      actualizado_en: new Date().toISOString(),
    });
  }
  // Hard delete: eliminación física
  return await http.delete<void>(`${BASE}/${id}`);
};

export const getPaginated = async (filters: UsuariosRolesFilters = {}) => {
  const query = buildQuery(filters);
  const response = await http.get<PaginatedResponse<UsuariosRoles>>(`${BASE}/paginated?${query}`);
  
  // Si no se especificó un estado en los filtros, filtramos los estados excluidos
  if (!filters.estado) {
    const filteredData = response.data.filter(element => 
      !EXCLUDED_STATES.includes(element.estado as string)
    );
    
    return {
      ...response,
      data: filteredData,
      total: filteredData.length,
    };
  }
  
  return response;
};

const buildQuery = (params: object) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  return query.toString();
};