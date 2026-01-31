export interface TemplatesInventarios {
  id?: number;
  nombre?: string;
  descripcion?: string;
  tipo?: string;
  tipo_entrada?: string;
  tipo_salida?: string;
  is_default?: boolean;
  contenido_hbs?: string;
  variables_utilizadas?: any;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface TemplatesInventariosGridRow {
  id?: number;
  nombre?: string;
  descripcion?: string;
  tipo?: string;
  tipo_entrada?: string;
  tipo_salida?: string;
  is_default?: boolean;
  contenido_hbs?: string;
  variables_utilizadas?: any;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface TemplatesInventariosCreateDTO {
  nombre?: string;
  descripcion?: string;
  tipo?: string;
  tipo_entrada?: string;
  tipo_salida?: string;
  is_default?: boolean;
  contenido_hbs?: string;
  variables_utilizadas?: any;
}

export interface TemplatesInventariosUpdateDTO {
  nombre?: string;
  descripcion?: string;
  tipo?: string;
  tipo_entrada?: string;
  tipo_salida?: string;
  is_default?: boolean;
  contenido_hbs?: string;
  variables_utilizadas?: any;
}

export interface TemplatesInventariosFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  nombre?: string;
  descripcion?: string;
  tipo?: string;
  tipo_entrada?: string;
  tipo_salida?: string;
  is_default?: boolean;
  contenido_hbs?: string;
  variables_utilizadas?: any;
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
