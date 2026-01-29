export interface UsuariosRoles {
  id?: number;
  usuario_id?: number;
  rol_id?: number;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface UsuariosRolesGridRow {
  id?: number;
  usuario_id?: number;
  rol_id?: number;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface UsuariosRolesCreateDTO {
  usuario_id?: number;
  rol_id?: number;
}

export interface UsuariosRolesUpdateDTO {
  usuario_id?: number;
  rol_id?: number;
}

export interface UsuariosRolesFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  usuario_id?: number;
  rol_id?: number;
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
