import { z } from 'zod';

export const ITEM_NAME_MAX_LENGTH = 120;
export const ITEM_DESCRIPTION_MAX_LENGTH = 500;

const name = z.string().trim().min(1).max(ITEM_NAME_MAX_LENGTH);
const description = z.string().max(ITEM_DESCRIPTION_MAX_LENGTH);

/** `GET /api/v1/items/:id`, and each element of `GET /api/v1/items`. */
export const itemSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

/** Body of `POST /api/v1/items`. */
export const createItemSchema = z.strictObject({
  name,
  description: description.optional(),
});

/** Body of `PATCH /api/v1/items/:id`: only the sent fields change; `description: null` clears it. */
export const updateItemSchema = z.strictObject({
  name: name.optional(),
  description: description.nullable().optional(),
});

export type Item = z.infer<typeof itemSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
