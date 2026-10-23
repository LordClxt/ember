import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import {
  ITEM_DESCRIPTION_MAX_LENGTH,
  ITEM_NAME_MAX_LENGTH,
} from '@ember/contracts';

export const items = pgTable('items', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: ITEM_NAME_MAX_LENGTH }).notNull(),
  description: varchar('description', { length: ITEM_DESCRIPTION_MAX_LENGTH }),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
    precision: 3,
  }).notNull(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
    precision: 3,
  }).notNull(),
});
