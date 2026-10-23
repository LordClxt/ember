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
  /** 1..120 characters */
  name: string;
  /** up to 500 characters */
  description?: string;
}

/** Body of `PATCH /api/v1/items/:id`: only the sent fields change. */
export interface UpdateItemInput {
  /** 1..120 characters; cannot be null */
  name?: string;
  /** up to 500 characters; null clears it */
  description?: string | null;
}
