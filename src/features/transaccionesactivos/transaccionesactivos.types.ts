export interface TransaccionesActivos {
  id?: number;
  transaccion_id?: number;
  activo_id?: number;
  cantidad?: number;
  estado_anterior?: string;
  estado_salida?: string;
  estado_retorno?: string;
  observacion?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface TransaccionesActivosGridRow {
  id?: number;
  transaccion_id?: number;
  activo_id?: number;
  cantidad?: number;
  estado_anterior?: string;
  estado_salida?: string;
  estado_retorno?: string;
  observacion?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface TransaccionesActivosCreateDTO {
  transaccion_id?: number;
  activo_id?: number;
  cantidad?: number;
  estado_anterior?: string;
  estado_salida?: string;
  estado_retorno?: string;
  observacion?: string;
}

export interface TransaccionesActivosUpdateDTO {
  transaccion_id?: number;
  activo_id?: number;
  cantidad?: number;
  estado_anterior?: string;
  estado_salida?: string;
  estado_retorno?: string;
  observacion?: string;
}

export interface TransaccionesActivosFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  transaccion_id?: number;
  activo_id?: number;
  cantidad?: number;
  estado_anterior?: string;
  estado_salida?: string;
  estado_retorno?: string;
  observacion?: string;
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
