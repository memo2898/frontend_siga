export interface Activos {
  id?: number;
  codigo_inventario_local?: string;
  codigo_inventario_control_bienes?: string;
  marca?: string;
  modelo?: string;
  categoria_id?: number;
  almacen_id?: number;
  estado_activo?: string;
  cantidad?: number;
  unidad_medida?: string;
  atributos?: any;
  fecha_ingreso?: string;
  observaciones?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface ActivosGridRow {
  id?: number;
  codigo_inventario_local?: string;
  codigo_inventario_control_bienes?: string;
  marca?: string;
  modelo?: string;
  categoria_id?: number;
  almacen_id?: number;
  estado_activo?: string;
  cantidad?: number;
  unidad_medida?: string;
  atributos?: any;
  fecha_ingreso?: string;
  observaciones?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface ActivosCreateDTO {
  codigo_inventario_local?: string;
  codigo_inventario_control_bienes?: string;
  marca?: string;
  modelo?: string;
  categoria_id?: number;
  almacen_id?: number;
  estado_activo?: string;
  cantidad?: number;
  unidad_medida?: string;
  atributos?: any;
  fecha_ingreso?: string;
  observaciones?: string;
}

export interface ActivosUpdateDTO {
  codigo_inventario_local?: string;
  codigo_inventario_control_bienes?: string;
  marca?: string;
  modelo?: string;
  categoria_id?: number;
  almacen_id?: number;
  estado_activo?: string;
  cantidad?: number;
  unidad_medida?: string;
  atributos?: any;
  fecha_ingreso?: string;
  observaciones?: string;
}

export interface ActivosFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  codigo_inventario_local?: string;
  codigo_inventario_control_bienes?: string;
  marca?: string;
  modelo?: string;
  categoria_id?: number;
  almacen_id?: number;
  estado_activo?: string;
  cantidad?: number;
  unidad_medida?: string;
  atributos?: any;
  fecha_ingreso?: string;
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
