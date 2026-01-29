import { type Direcciones } from "../direcciones/direcciones.types";
export interface Departamentos {
  id?: number;
  direccion_id?: number;
  nombre?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  direccion:Direcciones
}

export interface DepartamentosGridRow {
  id?: number;
  direccion_id?: number;
  nombre?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
  direccion: string;
}

export interface DepartamentosCreateDTO {
  direccion_id?: number;
  nombre?: string;
}

export interface DepartamentosUpdateDTO {
  direccion_id?: number;
  nombre?: string;
}

export interface DepartamentosFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  direccion_id?: number;
  nombre?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface GridieActionCell {
  content: string;
  event: string;
  funct: () => void;
}
