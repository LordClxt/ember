import { defineConfig } from 'drizzle-kit';

/**
 * One schema and one migrations folder per provider:
 * `DB_PROVIDER=postgres npm run db:generate` writes to `drizzle/postgres`.
 */
const provider = process.env.DB_PROVIDER ?? 'sqlite';
const dialects = {
  sqlite: 'turso',
  postgres: 'postgresql',
  mysql: 'mysql',
} as const;
const dialect = dialects[provider as keyof typeof dialects];
if (!dialect) {
  throw new Error(
    `Unknown DB_PROVIDER "${provider}" (expected sqlite, postgres or mysql)`,
  );
}

export default defineConfig({
  dialect,
  schema: `./src/core/database/schemas/${provider}/index.ts`,
  out: `./drizzle/${provider}`,
  dbCredentials: { url: process.env.DATABASE_URL ?? 'file:./data/ember.db' },
});
