import { env } from './env'
import type { ApiErrorBody } from '@ember/contracts'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type Query = Record<string, string | number | boolean | undefined>

interface RequestOptions extends Omit<RequestInit, 'body'> {
  query?: Query
  body?: unknown
}

/**
 * Thin `fetch` wrapper: prefixes the API base URL, serialises JSON and turns
 * non-2xx responses into {@link ApiError}. Works in the browser and during SSR.
 */
export async function apiFetch<T>(
  path: string,
  { query, body, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const url = new URL(`${env.apiUrl}/${path.replace(/^\//, '')}`)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }

  let response: Response
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Unable to reach the server.')
  }

  if (!response.ok) {
    const error = (await response
      .json()
      .catch(() => null)) as Partial<ApiErrorBody> | null
    const message = [error?.message ?? response.statusText].flat().join(', ')
    throw new ApiError(response.status, message)
  }

  return (response.status === 204 ? undefined : await response.json()) as T
}
