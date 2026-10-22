import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-lg border border-neutral-300 bg-transparent px-3 text-sm outline-none focus:border-ember-500 dark:border-neutral-700',
        className,
      )}
      {...props}
    />
  )
}
