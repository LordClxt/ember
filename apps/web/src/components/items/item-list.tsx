import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import type { Item } from '@ember/contracts'

interface ItemListProps {
  items: Array<Item>
  onDelete: (id: string) => void
}

export function ItemList({ items, onDelete }: ItemListProps) {
  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-neutral-500">
        No items yet. Add your first one!
      </p>
    )
  }

  return (
    <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between py-3">
          <Link
            to="/items/$id"
            params={{ id: item.id }}
            className="hover:text-ember-500"
          >
            {item.name}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete ${item.name}`}
            onClick={() => onDelete(item.id)}
          >
            ✕
          </Button>
        </li>
      ))}
    </ul>
  )
}
