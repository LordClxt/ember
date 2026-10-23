import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-bold text-ember-500">
          🔥 Ember
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: 'font-semibold text-ember-500' }}
          >
            Home
          </Link>
          <Link
            to="/items"
            activeProps={{ className: 'font-semibold text-ember-500' }}
          >
            Items
          </Link>
        </nav>
      </div>
    </header>
  )
}
