import { http } from '../../http';
import { SERVER_ROUTE } from '../../config';
import type { Personas, PersonasCreateDTO, PersonasUpdateDTO, PersonasFilters, PaginatedResponse } from './personas.types';

const BASE = `${SERVER_ROUTE}/api/personas`;

// Configuración del tipo de borrado (soft delete por defecto)
const IS_SOFT_DELETE = true;

// Estados que se excluyen por defecto en las consultas
const EXCLUDED_STATES: string[] = ['ELIMINADO', 'DELETED', 'BORRADO', 'INACTIVO', 'DESHABILITADO', 'SUSPENDIDO'];

export const getAll = async () => {
  const response = await http.get<Personas[]>(BASE);
  
  const data = response.filter(element => 
    !EXCLUDED_STATES.includes(element.estado as string)
  );
  
  return data;
};

export const getById = async (id: number) => {
  return await http.get<Personas>(`${BASE}/${id}`);
};

export const create = async (data: PersonasCreateDTO) => {
  const payload = {
    ...data,
    estado: 'ACTIVO',
    agregado_en: new Date().toISOString(),
  };
  return await http.post<Personas>(BASE, payload);
};

export const update = async (id: number, data: PersonasUpdateDTO) => {
  const payload = {
    ...data,
    actualizado_en: new Date().toISOString(),
  };
  return await http.patch<Personas>(`${BASE}/${id}`, payload);
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

export const getPaginated = async (filters: PersonasFilters = {}) => {
  const query = buildQuery(filters);
  const response = await http.get<PaginatedResponse<Personas>>(`${BASE}/paginated?${query}`);
  
  // Si no se especificó un estado en los filtros, filtramos los estados excluidos
  if (!filters.estado) {
    const filteredData = response.data.filter(element => 
      !EXCLUDED_STATES.includes(element.estado as string)
    );
    
    return {
      ...response,
      data: filteredData,
      meta: {
        ...response.meta,
        total: filteredData.length,
      },
    };
  }
  
  return response;
};



/**
 * Buscar persona por tipo de documento y número de documento
 * @param tipoDocumentoId - ID del tipo de documento (1=Cédula, 2=Pasaporte, 3=RNC, etc.)
 * @param numeroDocumento - Número de documento
 * @returns Persona encontrada o error 404
 */
export const getByDocumento = async (tipoDocumentoId: number, numeroDocumento: string) => {
  return await http.get<Personas>(`${BASE}/documento/${tipoDocumentoId}/${numeroDocumento}`);
};

/**
 * Verificar si existe una persona con un documento específico
 * @param tipoDocumentoId - ID del tipo de documento
 * @param numeroDocumento - Número de documento
 * @returns { exists: boolean }
 */
export const existsByDocumento = async (tipoDocumentoId: number, numeroDocumento: string) => {
  return await http.get<{ exists: boolean }>(`${BASE}/existe-documento/${tipoDocumentoId}/${numeroDocumento}`);
};

/**
 * Obtener personas por agregado_por (sin paginación)
 * @param agregadoPor - ID del usuario que agregó los registros
 */
export const getByAgregadoPor = async (agregadoPor: number) => {
  const response = await http.get<Personas[]>(`${BASE}/by-agregado-por/${agregadoPor}`);
  
  const data = response.filter(element => 
    !EXCLUDED_STATES.includes(element.estado as string)
  );
  
  return data;
};

/**
 * Obtener personas por actualizado_por (sin paginación)
 * @param actualizadoPor - ID del usuario que actualizó los registros
 */
export const getByActualizadoPor = async (actualizadoPor: number) => {
  const response = await http.get<Personas[]>(`${BASE}/by-actualizado-por/${actualizadoPor}`);
  
  const data = response.filter(element => 
    !EXCLUDED_STATES.includes(element.estado as string)
  );
  
  return data;
};

/**
 * Obtener personas por agregado_por con paginación
 * @param agregadoPor - ID del usuario que agregó los registros
 * @param filters - Filtros de paginación (page, limit, sort)
 */
export const getAgregadoPorPaginated = async (agregadoPor: number, filters: PersonasFilters = {}) => {
  const query = buildQuery(filters);
  const response = await http.get<PaginatedResponse<Personas>>(
    `${BASE}/by-agregado-por/${agregadoPor}/paginated?${query}`
  );
  
  if (!filters.estado) {
    const filteredData = response.data.filter(element => 
      !EXCLUDED_STATES.includes(element.estado as string)
    );
    
    return {
      ...response,
      data: filteredData,
      meta: {
        ...response.meta,
        total: filteredData.length,
      },
    };
  }
  
  return response;
};

/**
 * Obtener personas por actualizado_por con paginación
 * @param actualizadoPor - ID del usuario que actualizó los registros
 * @param filters - Filtros de paginación (page, limit, sort)
 */
export const getActualizadoPorPaginated = async (actualizadoPor: number, filters: PersonasFilters = {}) => {
  const query = buildQuery(filters);
  const response = await http.get<PaginatedResponse<Personas>>(
    `${BASE}/by-actualizado-por/${actualizadoPor}/paginated?${query}`
  );
  
  if (!filters.estado) {
    const filteredData = response.data.filter(element => 
      !EXCLUDED_STATES.includes(element.estado as string)
    );
    
    return {
      ...response,
      data: filteredData,
      meta: {
        ...response.meta,
        total: filteredData.length,
      },
    };
  }
  
  return response;
};

// Helper function
const buildQuery = (params: object) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  return query.toString();
};