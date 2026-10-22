import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const items = pgTable('items', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  description: varchar('description', { length: 500 }),
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
