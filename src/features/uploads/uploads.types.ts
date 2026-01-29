export interface Uploads {
  id?: number;
  filename?: string;
}

export interface UploadsGridRow {
  id?: number;
  filename?: string;
  actions: GridieActionCell[];
}

export interface UploadsCreateDTO {
  filename?: string;
}

export interface UploadsUpdateDTO {
  filename?: string;
}

export interface UploadsFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  filename?: string;
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
