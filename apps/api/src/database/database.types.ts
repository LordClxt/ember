import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { DATABASE_PROVIDERS } from './database.constants.js';
import type * as sqliteSchema from './schema/sqlite/index.js';

export type DatabaseProvider = (typeof DATABASE_PROVIDERS)[number];

export interface DatabaseConfig {
  provider: DatabaseProvider;
  url: string;
  autoMigrate: boolean;
}

/**
 * Drizzle schemas are dialect-specific, so each provider has its own copy in
 * `schema/<provider>/` with the same tables, columns and JS types.
 * Repositories are typed against the SQLite flavour and only use the query
 * builder subset shared by every dialect (no `.returning()`, no driver-specific
 * result metadata), which keeps them provider-agnostic at runtime.
 */
export type Schema = typeof sqliteSchema;
export type Database = LibSQLDatabase<Schema>;

export interface DatabaseConnection {
  provider: DatabaseProvider;
  db: Database;
  schema: Schema;
  migrate(): Promise<void>;
  close(): Promise<void>;
}
