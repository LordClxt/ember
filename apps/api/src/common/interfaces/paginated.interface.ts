export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

/** Standard envelope for list endpoints: `{ data, meta }`. */
export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}
