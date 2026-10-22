import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

/** Merges Tailwind classes, last one wins (shadcn/ui convention). */
export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}
