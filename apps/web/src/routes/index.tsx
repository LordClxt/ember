import { Link, createFileRoute } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <section className="py-12">
      <h1 className="text-4xl font-bold">Welcome to Ember</h1>
      <p className="mt-4 text-lg text-neutral-500">
        TanStack Start · NestJS · Kotlin Multiplatform boilerplate.
      </p>
      <Link to="/items" className={buttonVariants({ className: 'mt-8' })}>
        See the Items example →
      </Link>
    </section>
  )
}
