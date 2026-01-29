export interface Modulos {
  id?: number;
  nombre?: string;
  descripcion?: string;
  permite_asignacion?: boolean;
  permite_prestamo?: boolean;
  permite_descargo?: boolean;
  template_entrega_id?: number;
  template_recibo_id?: number;
  template_descargo_id?: number;
  configuracion?: any;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface ModulosGridRow {
  id?: number;
  nombre?: string;
  descripcion?: string;
  permite_asignacion?: boolean;
  permite_prestamo?: boolean;
  permite_descargo?: boolean;
  template_entrega_id?: number;
  template_recibo_id?: number;
  template_descargo_id?: number;
  configuracion?: any;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface ModulosCreateDTO {
  nombre?: string;
  descripcion?: string;
  permite_asignacion?: boolean;
  permite_prestamo?: boolean;
  permite_descargo?: boolean;
  template_entrega_id?: number;
  template_recibo_id?: number;
  template_descargo_id?: number;
  configuracion?: any;
}

export interface ModulosUpdateDTO {
  nombre?: string;
  descripcion?: string;
  permite_asignacion?: boolean;
  permite_prestamo?: boolean;
  permite_descargo?: boolean;
  template_entrega_id?: number;
  template_recibo_id?: number;
  template_descargo_id?: number;
  configuracion?: any;
}

export interface ModulosFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  nombre?: string;
  descripcion?: string;
  permite_asignacion?: boolean;
  permite_prestamo?: boolean;
  permite_descargo?: boolean;
  template_entrega_id?: number;
  template_recibo_id?: number;
  template_descargo_id?: number;
  configuracion?: any;
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
