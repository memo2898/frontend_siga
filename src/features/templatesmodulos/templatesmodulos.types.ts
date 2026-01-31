export interface TemplatesModulos {
  id?: number;
  nombre?: string;
  descripcion?: string;
  contenido_hbs?: string;
  variables_utilizadas?: any;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
}

export interface TemplatesModulosGridRow {
  id?: number;
  nombre?: string;
  descripcion?: string;
  contenido_hbs?: string;
  variables_utilizadas?: any;
  agregado_por?: number;
  agregado_en?: string;
  actualizado_por?: number;
  actualizado_en?: string;
  estado?: string;
  actions: GridieActionCell[];
}

export interface TemplatesModulosCreateDTO {
  nombre?: string;
  descripcion?: string;
  contenido_hbs?: string;
  variables_utilizadas?: any;
}

export interface TemplatesModulosUpdateDTO {
  nombre?: string;
  descripcion?: string;
  contenido_hbs?: string;
  variables_utilizadas?: any;
}

export interface TemplatesModulosFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  nombre?: string;
  descripcion?: string;
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
