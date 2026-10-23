import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ErrorMessage } from '@/components/error-message'
import { ItemForm } from '@/components/items/item-form'
import { ItemList } from '@/components/items/item-list'
import { Pagination } from '@/components/items/pagination'
import { useItemMutations } from '@/hooks/use-item-mutations'
import { itemsQueryOptions } from '@/lib/items'

interface ItemsSearch {
  /** Optional so links can omit it; defaults to 1. */
  page?: number
}

export const Route = createFileRoute('/items/')({
  validateSearch: (search: Record<string, unknown>): ItemsSearch => {
    const page = Number(search.page)
    return Number.isInteger(page) && page > 1 ? { page } : {}
  },
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  // Runs on the server for the first render, then on client navigations.
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(itemsQueryOptions(deps.page)),
  component: ItemsPage,
})

function ItemsPage() {
  const { page = 1 } = Route.useSearch()
  const { data } = useSuspenseQuery(itemsQueryOptions(page))
  const { create, remove } = useItemMutations()
  const mutationError = create.error ?? remove.error

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">
        Items{' '}
        <small className="text-base font-normal text-neutral-500">
          ({data.meta.total})
        </small>
      </h1>
      <ItemForm
        onSubmit={(name) => create.mutateAsync({ name })}
        pending={create.isPending}
      />
      {mutationError && (
        <div className="mt-4">
          <ErrorMessage error={mutationError} />
        </div>
      )}
      <div className="mt-6">
        <ItemList items={data.data} onDelete={(id) => remove.mutate(id)} />
      </div>
      <Pagination {...data.meta} />
    </>
  )
}
