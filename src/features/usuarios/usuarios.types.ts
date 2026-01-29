export interface Usuarios {
  id?: number;
  nombre?: string;
  email?: string;
  password?: string;
  departamento_id?: number;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface UsuariosGridRow {
  id?: number;
  nombre?: string;
  email?: string;
  password?: string;
  departamento_id?: number;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface UsuariosCreateDTO {
  nombre?: string;
  email?: string;
  password?: string;
  departamento_id?: number;
}

export interface UsuariosUpdateDTO {
  nombre?: string;
  email?: string;
  password?: string;
  departamento_id?: number;
}

export interface UsuariosFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  nombre?: string;
  email?: string;
  password?: string;
  departamento_id?: number;
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
