import { defineConfig } from 'vitest/config'
import viteReact from '@vitejs/plugin-react'

// Separate from vite.config.ts: unit tests don't need the Start/SSR plugins.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [viteReact()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
