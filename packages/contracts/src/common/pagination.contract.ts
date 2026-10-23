import { z } from 'zod';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/** Query string accepted by every paginated endpoint (`?page=2&limit=20`). */
export const paginationQuerySchema = z.strictObject({
  page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(PAGINATION.MAX_LIMIT)
    .default(PAGINATION.DEFAULT_LIMIT),
});

export const paginationMetaSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
});

/** List envelope `{ data, meta }` returned by every paginated endpoint. */
export const paginatedSchema = <T extends z.ZodType>(item: T) =>
  z.object({ data: z.array(item), meta: paginationMetaSchema });

/** What a client may send (every field optional). */
export type PaginationQuery = z.input<typeof paginationQuerySchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}
