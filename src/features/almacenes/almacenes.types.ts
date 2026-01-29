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
