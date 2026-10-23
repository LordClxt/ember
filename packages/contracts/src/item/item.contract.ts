/** Validation limits of an item, used by the API DTOs and the client forms. */
export const ITEM_NAME_MAX_LENGTH = 120;
export const ITEM_DESCRIPTION_MAX_LENGTH = 500;

/** `GET /api/v1/items/:id`, and each element of `GET /api/v1/items`. */
export interface Item {
  /** UUID v7 */
  id: string;
  name: string;
  description: string | null;
  /** ISO 8601, UTC */
  createdAt: string;
  /** ISO 8601, UTC */
  updatedAt: string;
}

/** Body of `POST /api/v1/items`. */
export interface CreateItemInput {
  /** 1..`ITEM_NAME_MAX_LENGTH` characters */
  name: string;
  /** up to `ITEM_DESCRIPTION_MAX_LENGTH` characters */
  description?: string;
}

/** Body of `PATCH /api/v1/items/:id`: only the sent fields change. */
export interface UpdateItemInput {
  /** 1..`ITEM_NAME_MAX_LENGTH` characters; cannot be null */
  name?: string;
  /** up to `ITEM_DESCRIPTION_MAX_LENGTH` characters; null clears it */
  description?: string | null;
}
