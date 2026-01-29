export interface Transacciones {
  id?: number;
  codigo?: string;
  modulo_id?: number;
  persona_id?: number;
  tipo?: any;
  tipo_salida?: any;
  fecha?: string;
  usuario_id?: number;
  rol_id?: number;
  fecha_devolucion_esperada?: string;
  fecha_devolucion_real?: string;
  motivo_descargo?: any;
  comentario_descargo?: string;
  metadata?: any;
  estado_transaccion?: any;
  observaciones?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface TransaccionesGridRow {
  id?: number;
  codigo?: string;
  modulo_id?: number;
  persona_id?: number;
  tipo?: any;
  tipo_salida?: any;
  fecha?: string;
  usuario_id?: number;
  rol_id?: number;
  fecha_devolucion_esperada?: string;
  fecha_devolucion_real?: string;
  motivo_descargo?: any;
  comentario_descargo?: string;
  metadata?: any;
  estado_transaccion?: any;
  observaciones?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface TransaccionesCreateDTO {
  codigo?: string;
  modulo_id?: number;
  persona_id?: number;
  tipo?: any;
  tipo_salida?: any;
  fecha?: string;
  usuario_id?: number;
  rol_id?: number;
  fecha_devolucion_esperada?: string;
  fecha_devolucion_real?: string;
  motivo_descargo?: any;
  comentario_descargo?: string;
  metadata?: any;
  estado_transaccion?: any;
  observaciones?: string;
}

export interface TransaccionesUpdateDTO {
  codigo?: string;
  modulo_id?: number;
  persona_id?: number;
  tipo?: any;
  tipo_salida?: any;
  fecha?: string;
  usuario_id?: number;
  rol_id?: number;
  fecha_devolucion_esperada?: string;
  fecha_devolucion_real?: string;
  motivo_descargo?: any;
  comentario_descargo?: string;
  metadata?: any;
  estado_transaccion?: any;
  observaciones?: string;
}

export interface TransaccionesFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  codigo?: string;
  modulo_id?: number;
  persona_id?: number;
  tipo?: any;
  tipo_salida?: any;
  fecha?: string;
  usuario_id?: number;
  rol_id?: number;
  fecha_devolucion_esperada?: string;
  fecha_devolucion_real?: string;
  motivo_descargo?: any;
  comentario_descargo?: string;
  metadata?: any;
  estado_transaccion?: any;
  observaciones?: string;
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
