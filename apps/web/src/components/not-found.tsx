import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-neutral-500">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className={buttonVariants({ className: 'mt-6' })}>
        Back home
      </Link>
    </div>
  )
}
