import { mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import {
  ITEM_DESCRIPTION_MAX_LENGTH,
  ITEM_NAME_MAX_LENGTH,
} from '@ember/contracts';

export const items = mysqlTable('items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: ITEM_NAME_MAX_LENGTH }).notNull(),
  description: varchar('description', { length: ITEM_DESCRIPTION_MAX_LENGTH }),
  createdAt: timestamp('created_at', { mode: 'date', fsp: 3 }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', fsp: 3 }).notNull(),
});
