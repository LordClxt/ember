import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Each app instance gets its own migrated in-memory database.
    env: { NODE_ENV: 'test', DB_PROVIDER: 'sqlite', DATABASE_URL: ':memory:' },
  },
});
