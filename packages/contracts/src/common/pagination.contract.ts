/** Pagination rules of every list endpoint, shared by the API (DTO) and clients. */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/** Query string accepted by every paginated endpoint (`?page=2&limit=20`). */
export interface PaginationQuery {
  /** >= 1, default `PAGINATION.DEFAULT_PAGE` */
  page?: number;
  /** 1..`PAGINATION.MAX_LIMIT`, default `PAGINATION.DEFAULT_LIMIT` */
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

/** List envelope `{ data, meta }` returned by every paginated endpoint. */
export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}
