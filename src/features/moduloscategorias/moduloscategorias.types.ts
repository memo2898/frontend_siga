export interface ModulosCategorias {
  id?: number;
  modulo_id?: number;
  categoria_id?: number;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface ModulosCategoriasGridRow {
  id?: number;
  modulo_id?: number;
  categoria_id?: number;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface ModulosCategoriasCreateDTO {
  modulo_id?: number;
  categoria_id?: number;
}

export interface ModulosCategoriasUpdateDTO {
  modulo_id?: number;
  categoria_id?: number;
}

export interface ModulosCategoriasFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  modulo_id?: number;
  categoria_id?: number;
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
