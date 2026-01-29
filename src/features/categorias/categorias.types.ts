export interface Categorias {
  id?: number;
  nombre?: string;
  descripcion?: string;
  tipo_control?: string;
  campos_activo?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface CategoriasGridRow {
  id?: number;
  nombre?: string;
  descripcion?: string;
  tipo_control?: string;
  campos_activo?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface CategoriasCreateDTO {
  nombre?: string;
  descripcion?: string;
  tipo_control?: string;
  campos_activo?: string;
}

export interface CategoriasUpdateDTO {
  nombre?: string;
  descripcion?: string;
  tipo_control?: string;
  campos_activo?: string;
}

export interface CategoriasFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  nombre?: string;
  descripcion?: string;
  tipo_control?: string;
  campos_activo?: string;
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
