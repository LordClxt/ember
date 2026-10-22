export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

/** Mirrors the API list envelope `{ data, meta }`. */
export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  path: string;
  timestamp: string;
}
