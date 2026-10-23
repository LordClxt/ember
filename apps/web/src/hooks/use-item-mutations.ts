import { useMutation, useQueryClient } from '@tanstack/react-query'
import { itemKeys, itemsApi } from '@/lib/items'
import type { CreateItemInput } from '@/lib/items'

/** Write operations on items; every success refreshes the cached lists. */
export function useItemMutations() {
  const queryClient = useQueryClient()
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: itemKeys.all })

  const create = useMutation({
    mutationFn: (input: CreateItemInput) => itemsApi.create(input),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => itemsApi.remove(id),
    onSuccess: invalidate,
  })

  return { create, remove }
}
