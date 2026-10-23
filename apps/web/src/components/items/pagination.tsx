import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'
import type { PaginationMeta } from '@ember/contracts'

export function Pagination({ page, limit, total }: PaginationMeta) {
  const pages = Math.max(1, Math.ceil(total / limit))
  if (pages === 1) return null

  return (
    <nav
      className="mt-6 flex items-center justify-between text-sm"
      aria-label="Pagination"
    >
      <Link
        to="/items"
        search={{ page: page - 1 }}
        disabled={page <= 1}
        className={buttonVariants({
          variant: 'outline',
          size: 'sm',
          className: page <= 1 && 'opacity-50',
        })}
      >
        Previous
      </Link>
      <span>
        Page {page} / {pages}
      </span>
      <Link
        to="/items"
        search={{ page: page + 1 }}
        disabled={page >= pages}
        className={buttonVariants({
          variant: 'outline',
          size: 'sm',
          className: page >= pages && 'opacity-50',
        })}
      >
        Next
      </Link>
    </nav>
  )
}
