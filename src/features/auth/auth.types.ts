export interface Auth {
  id?: number;
  username?: string;
  password?: string;
}

export interface AuthGridRow {
  id?: number;
  username?: string;
  password?: string;
  actions: GridieActionCell[];
}

export interface AuthCreateDTO {
  username?: string;
  password?: string;
}

export interface AuthUpdateDTO {
  username?: string;
  password?: string;
}

export interface AuthFilters {
  page?: number;
  limit?: number;
  sort?: string;
  id?: number;
  username?: string;
  password?: string;
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
