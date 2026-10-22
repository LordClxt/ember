import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'
import { ErrorMessage } from '@/components/error-message'
import { NotFound } from '@/components/not-found'
import { createQueryClient } from '@/lib/query-client'

export function getRouter() {
  const queryClient = createQueryClient()

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    // Freshness is handled by TanStack Query, not by the router cache.
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ({ error, reset }) => (
      <ErrorMessage error={error} onRetry={reset} />
    ),
    defaultNotFoundComponent: NotFound,
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
