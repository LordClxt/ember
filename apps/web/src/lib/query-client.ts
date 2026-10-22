import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './api-client'

/** One QueryClient per request on the server, one per tab in the browser. */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        // 4xx won't fix themselves: only retry network/5xx errors.
        retry: (failureCount, error) =>
          !(
            error instanceof ApiError &&
            error.status >= 400 &&
            error.status < 500
          ) && failureCount < 2,
      },
    },
  })
}
