import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-ember-500 text-white hover:bg-ember-600',
        outline:
          'border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900',
        ghost: 'hover:bg-neutral-100 dark:hover:bg-neutral-900',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-3',
        icon: 'size-8',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export function Button({
  className,
  variant,
  size,
  ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
