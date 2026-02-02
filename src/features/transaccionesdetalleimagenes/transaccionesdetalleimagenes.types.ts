export interface TransaccionesDetalleImagenes {
  id?: number;
  transaccion_detalle_id?: number;
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
  agregadoPor?: number;
  actualizadoPor?: number;
}

export interface TransaccionesDetalleImagenesGridRow {
  id?: number;
  transaccion_detalle_id?: number;
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
  agregadoPor?: number;
  actualizadoPor?: number;
  actions: GridieActionCell[];
}

export interface TransaccionesDetalleImagenesCreateDTO {
  transaccion_detalle_id?: number;
  tipo?: any;
  url?: string;
  nombre_archivo?: string;
  descripcion?: string;
  orden?: number;
  agregadoPor?: number;
  actualizadoPor?: number;
}

export interface TransaccionesDetalleImagenesUpdateDTO {
  transaccion_detalle_id?: number;
  tipo?: any;
  url?: string;
  nombre_archivo?: string;
  descripcion?: string;
  orden?: number;
  agregadoPor?: number;
  actualizadoPor?: number;
}

export interface TransaccionesDetalleImagenesFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  transaccion_detalle_id?: number;
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
  agregadoPor?: number;
  actualizadoPor?: number;
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
