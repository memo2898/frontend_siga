import { http } from '../../http';
import { SERVER_ROUTE } from '../../config';
import type { Uploads, UploadsCreateDTO, UploadsUpdateDTO, UploadsFilters, PaginatedResponse } from './uploads.types';

const BASE = `${SERVER_ROUTE}/api/uploads/files`;

export const getAll = async () => {
  return await http.get<Uploads[]>(BASE);
};

export const getById = async (id: number) => {
  return await http.get<Uploads>(`${BASE}/${id}`);
};

export const create = async (data: UploadsCreateDTO) => {
  const payload = {
    ...data,
  };
  return await http.post<Uploads>(BASE, payload);
};

export const update = async (id: number, data: UploadsUpdateDTO) => {
  const payload = {
    ...data,
  };
  return await http.patch<Uploads>(`${BASE}/${id}`, payload);
};

export const remove = async (id: number) => {
  return await http.delete<void>(`${BASE}/${id}`);
};

export const getPaginated = async (filters: UploadsFilters = {}) => {
  const query = buildQuery(filters);
  const response = await http.get<PaginatedResponse<Uploads>>(`${BASE}/paginated?${query}`);
  
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