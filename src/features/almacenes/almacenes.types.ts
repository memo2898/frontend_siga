export interface Almacenes {
  id?: number;
  nombre?: string;
  sede_id?: number;
  ubicacion?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface AlmacenesGridRow {
  id?: number;
  nombre?: string;
  sede_id?: number;
  ubicacion?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface AlmacenesCreateDTO {
  nombre?: string;
  sede_id?: number;
  ubicacion?: string;
}

export interface AlmacenesUpdateDTO {
  nombre?: string;
  sede_id?: number;
  ubicacion?: string;
}

export interface AlmacenesFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  nombre?: string;
  sede_id?: number;
  ubicacion?: string;
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

export interface AlmacenesDetalleFilters {
  cantidadLimit?: number;
  cantidadPage?: number;
  unitariosLimit?: number;
  unitariosPage?: number;
}

export interface ActivoDetalle {
  id: number;
  codigo_inventario_local: string;
  codigo_inventario_control_bienes?: string;
  marca?: string;
  modelo?: string;
  estado_activo: string;
  cantidad?: number;
  unidad_medida?: string;
  fecha_ingreso?: string;
  observaciones?: string;
}

export interface AlmacenesDetalleResponse {
  almacen: {
    id: number;
    nombre: string;
    ubicacion: string;
    estado: string;
    agregado_en: string;
    actualizado_en: string | null;
  };
  sede: {
    id: number;
    nombre: string;
    direccion_fisica: string;
  };
  estadisticas: {
    totalActivos: number;
    activosDisponibles: number;
    activosAsignados: number;
    activosPrestados: number;
    activosMantenimiento: number;
    activosDescargados: number;
    valorTotal: number;
    categorias: unknown[];
    alertasStockBajo: number;
  };
  ultimosMovimientos: unknown[];
  activosUnitarios: PaginatedResponse<ActivoDetalle>;
  activosCantidad: PaginatedResponse<ActivoDetalle>;
}
