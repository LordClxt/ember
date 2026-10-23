/** Body of every error response (built by the API's `AllExceptionsFilter`). */
export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  path: string;
  /** ISO 8601, UTC */
  timestamp: string;
}
