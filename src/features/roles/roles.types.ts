export interface Roles {
  id?: number;
  nombre?: string;
  descripcion?: string;
  permisos?: any;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface RolesGridRow {
  id?: number;
  nombre?: string;
  descripcion?: string;
  permisos?: any;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface RolesCreateDTO {
  nombre?: string;
  descripcion?: string;
  permisos?: any;
}

export interface RolesUpdateDTO {
  nombre?: string;
  descripcion?: string;
  permisos?: any;
}

export interface RolesFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  nombre?: string;
  descripcion?: string;
  permisos?: any;
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
