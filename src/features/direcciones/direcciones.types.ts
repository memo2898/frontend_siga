import { type Sedes } from "../sedes/sedes.types";
export interface Direcciones {
  id?: number;
  sede_id?: number;
  nombre?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  sede:Sedes;
}

export interface DireccionesGridRow {
  id?: number;
  sede_id?: number;
  nombre?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
  
  sede_name: string;
}

export interface DireccionesCreateDTO {
  sede_id?: number;
  nombre?: string;
}

export interface DireccionesUpdateDTO {
  sede_id?: number;
  nombre?: string;
}

export interface DireccionesFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  sede_id?: number;
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
