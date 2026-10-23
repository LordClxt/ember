import { z } from 'zod';

/** Body of every error response (built by the API's `AllExceptionsFilter`). */
export const apiErrorBodySchema = z.object({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.array(z.string())]),
  path: z.string(),
  timestamp: z.iso.datetime(),
});

export type ApiErrorBody = z.infer<typeof apiErrorBodySchema>;
