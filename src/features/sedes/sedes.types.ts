export interface Sedes {
  id?: number;
  nombre?: string;
  direccion_fisica?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface SedesGridRow {
  id?: number;
  nombre?: string;
  direccion_fisica?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface SedesCreateDTO {
  nombre?: string;
  direccion_fisica?: string;
}

export interface SedesUpdateDTO {
  nombre?: string;
  direccion_fisica?: string;
}

export interface SedesFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  nombre?: string;
  direccion_fisica?: string;
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
