import type { DatabaseConfig } from '../database/database.types.js';

export const DEFAULT_SQLITE_URL = 'file:./data/ember.db';

/**
 * Typed configuration factory. Read values with
 * `configService.get('app.port', { infer: true })`.
 * Runs after `validateEnv`, so values are known to be well-formed.
 */
export const configuration = () => ({
  app: {
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3001')
      .split(',')
      .map((origin) => origin.trim()),
  },
  database: {
    provider: (process.env.DB_PROVIDER ??
      'sqlite') as DatabaseConfig['provider'],
    url: process.env.DATABASE_URL ?? DEFAULT_SQLITE_URL,
    autoMigrate: (process.env.DB_AUTO_MIGRATE ?? 'true') === 'true',
  } satisfies DatabaseConfig,
});

export type AppConfig = ReturnType<typeof configuration>;
