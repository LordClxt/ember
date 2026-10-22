import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '@/components/not-found'

/** Catch-all: any URL not matched by another route. */
export const Route = createFileRoute('/$')({ component: NotFound })
