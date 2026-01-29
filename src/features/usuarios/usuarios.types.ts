export interface Usuarios {
  id?: number;
  nombre?: string;
  apellido?: string;
  username?: string;
  email?: string;
  password_hash?: string;
  avatar_url?: string;
  ultimo_acceso?: any;
  intentos_fallidos?: number;
  bloqueado_hasta?: any;
  debe_cambiar_password?: boolean;
  fecha_ultimo_cambio_password?: any;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface UsuariosGridRow {
  id?: number;
  nombre?: string;
  apellido?: string;
  username?: string;
  email?: string;
  password_hash?: string;
  avatar_url?: string;
  ultimo_acceso?: any;
  intentos_fallidos?: number;
  bloqueado_hasta?: any;
  debe_cambiar_password?: boolean;
  fecha_ultimo_cambio_password?: any;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface UsuariosCreateDTO {
  nombre?: string;
  apellido?: string;
  username?: string;
  email?: string;
  password_hash?: string;
  avatar_url?: string;
  ultimo_acceso?: any;
  intentos_fallidos?: number;
  bloqueado_hasta?: any;
  debe_cambiar_password?: boolean;
  fecha_ultimo_cambio_password?: any;
}

export interface UsuariosUpdateDTO {
  nombre?: string;
  apellido?: string;
  username?: string;
  email?: string;
  password_hash?: string;
  avatar_url?: string;
  ultimo_acceso?: any;
  intentos_fallidos?: number;
  bloqueado_hasta?: any;
  debe_cambiar_password?: boolean;
  fecha_ultimo_cambio_password?: any;
}

export interface UsuariosFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  nombre?: string;
  apellido?: string;
  username?: string;
  email?: string;
  password_hash?: string;
  avatar_url?: string;
  ultimo_acceso?: any;
  intentos_fallidos?: number;
  bloqueado_hasta?: any;
  debe_cambiar_password?: boolean;
  fecha_ultimo_cambio_password?: any;
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
