export interface Personas {
  id?: number;
  nombre?: string;
  tipo_documento_id?: number;
  numero_documento?: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
  departamento_id?: number;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface PersonasGridRow {
  id?: number;
  nombre?: string;
  tipo_documento_id?: number;
  numero_documento?: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
  departamento_id?: number;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface PersonasCreateDTO {
  nombre?: string;
  tipo_documento_id?: number;
  numero_documento?: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
  departamento_id?: number;
}

export interface PersonasUpdateDTO {
  nombre?: string;
  tipo_documento_id?: number;
  numero_documento?: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
  departamento_id?: number;
}

export interface PersonasFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  nombre?: string;
  tipo_documento_id?: number;
  numero_documento?: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
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
