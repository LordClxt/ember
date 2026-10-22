import { Outlet, createFileRoute } from '@tanstack/react-router'

/** Layout shared by every `/items/*` page. */
export const Route = createFileRoute('/items')({
  head: () => ({ meta: [{ title: 'Items · Ember' }] }),
  component: ItemsLayout,
})

function ItemsLayout() {
  return (
    <section>
      <Outlet />
    </section>
  )
}
