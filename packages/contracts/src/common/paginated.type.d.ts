/** Query string accepted by every paginated endpoint. */
export interface PaginationQuery {
  /** >= 1, default 1 */
  page?: number;
  /** 1..100, default 20 */
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
