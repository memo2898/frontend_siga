export interface TransaccionesImagenes {
  id?: number;
  transaccion_id?: number;
  activo_id?: number;
  momento?: string;
  tipo?: any;
  url?: string;
  nombre_archivo?: string;
  descripcion?: string;
  orden?: number;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface TransaccionesImagenesGridRow {
  id?: number;
  transaccion_id?: number;
  activo_id?: number;
  momento?: string;
  tipo?: any;
  url?: string;
  nombre_archivo?: string;
  descripcion?: string;
  orden?: number;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface TransaccionesImagenesCreateDTO {
  transaccion_id?: number;
  activo_id?: number;
  momento?: string;
  tipo?: any;
  url?: string;
  nombre_archivo?: string;
  descripcion?: string;
  orden?: number;
}

export interface TransaccionesImagenesUpdateDTO {
  transaccion_id?: number;
  activo_id?: number;
  momento?: string;
  tipo?: any;
  url?: string;
  nombre_archivo?: string;
  descripcion?: string;
  orden?: number;
}

export interface TransaccionesImagenesFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  transaccion_id?: number;
  activo_id?: number;
  momento?: string;
  tipo?: any;
  url?: string;
  nombre_archivo?: string;
  descripcion?: string;
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
