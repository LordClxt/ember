import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  ITEM_DESCRIPTION_MAX_LENGTH,
  ITEM_NAME_MAX_LENGTH,
} from '@ember/contracts';

export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  name: text('name', { length: ITEM_NAME_MAX_LENGTH }).notNull(),
  description: text('description', { length: ITEM_DESCRIPTION_MAX_LENGTH }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});
