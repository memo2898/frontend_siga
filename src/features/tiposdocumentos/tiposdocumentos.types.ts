export interface TiposDocumentos {
  id?: number;
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  formato_validacion?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface TiposDocumentosGridRow {
  id?: number;
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  formato_validacion?: string;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface TiposDocumentosCreateDTO {
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  formato_validacion?: string;
}

export interface TiposDocumentosUpdateDTO {
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  formato_validacion?: string;
}

export interface TiposDocumentosFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  formato_validacion?: string;
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
