export interface ActivosImagenes {
  id?: number;
  activo_id?: number;
  tipo?: any;
  url?: string;
  nombre_archivo?: string;
  descripcion?: string;
  es_principal?: boolean;
  orden?: number;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface ActivosImagenesGridRow {
  id?: number;
  activo_id?: number;
  tipo?: any;
  url?: string;
  nombre_archivo?: string;
  descripcion?: string;
  es_principal?: boolean;
  orden?: number;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface ActivosImagenesCreateDTO {
  activo_id?: number;
  tipo?: any;
  url?: string;
  nombre_archivo?: string;
  descripcion?: string;
  es_principal?: boolean;
  orden?: number;
}

export interface ActivosImagenesUpdateDTO {
  activo_id?: number;
  tipo?: any;
  url?: string;
  nombre_archivo?: string;
  descripcion?: string;
  es_principal?: boolean;
  orden?: number;
}

export interface ActivosImagenesFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  activo_id?: number;
  tipo?: any;
  url?: string;
  nombre_archivo?: string;
  descripcion?: string;
  es_principal?: boolean;
  orden?: number;
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
