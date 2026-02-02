export interface TransaccionesDetalle {
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

export interface TransaccionesDetalleGridRow {
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

export interface TransaccionesDetalleCreateDTO {
  transaccion_id?: number;
  activo_id?: number;
  cantidad?: number;
  estado_anterior?: string;
  estado_salida?: string;
  estado_retorno?: string;
  observacion?: string;
}

export interface TransaccionesDetalleUpdateDTO {
  transaccion_id?: number;
  activo_id?: number;
  cantidad?: number;
  estado_anterior?: string;
  estado_salida?: string;
  estado_retorno?: string;
  observacion?: string;
}

export interface TransaccionesDetalleFilters {
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
