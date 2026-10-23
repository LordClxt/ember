import { fileURLToPath } from 'node:url';
import { createDatabase } from '../../src/core/database/database.factory.js';
import type {
  Database,
  DatabaseConnection,
  Schema,
} from '../../src/core/database/database.types.js';

/** Fresh, migrated in-memory SQLite database. */
export async function createSqliteTestDatabase(): Promise<DatabaseConnection> {
  const connection = await createDatabase({
    provider: 'sqlite',
    url: ':memory:',
  });
  await connection.migrate();
  return connection;
}

/**
 * Fresh, migrated in-process Postgres (PGlite, WebAssembly): checks that
 * repositories and the `drizzle/postgres` migrations work without a server.
 */
export async function createPostgresTestDatabase(): Promise<DatabaseConnection> {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  const schema =
    await import('../../src/core/database/schemas/postgres/index.js');
  const client = new PGlite();
  const db = drizzle(client, { schema });
  await migrate(db, {
    migrationsFolder: fileURLToPath(
      new URL('../../drizzle/postgres', import.meta.url),
    ),
  });
  return {
    provider: 'postgres',
    db: db as unknown as Database,
    schema: schema as unknown as Schema,
    migrate: () => Promise.resolve(),
    close: () => client.close(),
  };
}
