import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ApiError } from '@/lib/api-client'
import { itemQueryOptions } from '@/lib/items'

export const Route = createFileRoute('/items/$id')({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(
        itemQueryOptions(params.id),
      )
    } catch (error) {
      // 400 = malformed UUID, 404 = unknown id: both are "not found" for the user.
      if (
        error instanceof ApiError &&
        (error.status === 404 || error.status === 400)
      )
        throw notFound()
      throw error
    }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.name ?? 'Item'} · Ember` }],
  }),
  component: ItemPage,
})

function ItemPage() {
  const { id } = Route.useParams()
  const { data: item } = useSuspenseQuery(itemQueryOptions(id))

  return (
    <article>
      <Link
        to="/items"

        className="text-sm text-neutral-500 hover:text-ember-500"
      >
        ← All items
      </Link>
      <h1 className="mt-4 text-3xl font-bold">{item.name}</h1>
      <p className="mt-2 text-neutral-500">
        {item.description ?? 'No description.'}
      </p>
      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-neutral-500">Created</dt>
        <dd>{new Date(item.createdAt).toLocaleString()}</dd>
        <dt className="text-neutral-500">Updated</dt>
        <dd>{new Date(item.updatedAt).toLocaleString()}</dd>
      </dl>
    </article>
  )
}
