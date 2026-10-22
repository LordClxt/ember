import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  Database,
  DatabaseConfig,
  DatabaseConnection,
  Schema,
} from './database.types.js';

/** `apps/api/drizzle/<provider>`, resolved from both `src/` and `dist/`. */
const migrationsFolder = (provider: string) =>
  fileURLToPath(new URL(`../../drizzle/${provider}`, import.meta.url));

/**
 * Opens a Drizzle connection for the configured provider. Drivers are loaded
 * lazily so only the one in use needs to be installed in production.
 */
export async function createDatabase({
  provider,
  url,
}: Pick<DatabaseConfig, 'provider' | 'url'>): Promise<DatabaseConnection> {
  switch (provider) {
    case 'sqlite': {
      const { createClient } = await import('@libsql/client');
      const { drizzle } = await import('drizzle-orm/libsql');
      const { migrate } = await import('drizzle-orm/libsql/migrator');
      const schema = await import('./schema/sqlite/index.js');
      ensureSqliteDirectory(url);
      const client = createClient({ url });
      const db = drizzle(client, { schema });
      return {
        provider,
        db,
        schema,
        migrate: () =>
          migrate(db, { migrationsFolder: migrationsFolder(provider) }),
        close: () => Promise.resolve(client.close()),
      };
    }
    case 'postgres': {
      const { Pool } = (await import('pg')).default;
      const { drizzle } = await import('drizzle-orm/node-postgres');
      const { migrate } = await import('drizzle-orm/node-postgres/migrator');
      const schema = await import('./schema/postgres/index.js');
      const pool = new Pool({ connectionString: url });
      const db = drizzle(pool, { schema });
      return {
        provider,
        db: db as unknown as Database,
        schema: schema as unknown as Schema,
        migrate: () =>
          migrate(db, { migrationsFolder: migrationsFolder(provider) }),
        close: () => pool.end(),
      };
    }
    case 'mysql': {
      const mysql = (await import('mysql2/promise')).default;
      const { drizzle } = await import('drizzle-orm/mysql2');
      const { migrate } = await import('drizzle-orm/mysql2/migrator');
      const schema = await import('./schema/mysql/index.js');
      const pool = mysql.createPool({ uri: url });
      const db = drizzle(pool, { schema, mode: 'default' });
      return {
        provider,
        db: db as unknown as Database,
        schema: schema as unknown as Schema,
        migrate: () =>
          migrate(db, { migrationsFolder: migrationsFolder(provider) }),
        close: () => pool.end(),
      };
    }
  }
}

/** libSQL creates the database file but not its parent directory. */
function ensureSqliteDirectory(url: string) {
  if (!url.startsWith('file:')) return;
  const path = url.slice('file:'.length);
  mkdirSync(dirname(path), { recursive: true });
}
