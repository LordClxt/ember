import { queryOptions } from '@tanstack/react-query'
import { apiFetch } from './api-client'
import type { Paginated } from './api-client'

export interface Item {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateItemInput {
  name: string
  description?: string
}

/** Endpoints of `/api/v1/items`. */
export const itemsApi = {
  list: (page = 1, limit = 20) =>
    apiFetch<Paginated<Item>>('items', { query: { page, limit } }),
  get: (id: string) => apiFetch<Item>(`items/${id}`),
  create: (input: CreateItemInput) =>
    apiFetch<Item>('items', { method: 'POST', body: input }),
  remove: (id: string) => apiFetch<void>(`items/${id}`, { method: 'DELETE' }),
}

/** Query keys in one place, so invalidation stays consistent. */
export const itemKeys = {
  all: ['items'] as const,
  list: (page: number) => [...itemKeys.all, 'list', page] as const,
  detail: (id: string) => [...itemKeys.all, 'detail', id] as const,
}

export const itemsQueryOptions = (page: number) =>
  queryOptions({
    queryKey: itemKeys.list(page),
    queryFn: () => itemsApi.list(page),
  })

export const itemQueryOptions = (id: string) =>
  queryOptions({
    queryKey: itemKeys.detail(id),
    queryFn: () => itemsApi.get(id),
  })
