import { Inject, Injectable } from '@nestjs/common';
import { asc, count, eq } from 'drizzle-orm';
import { DATABASE } from '../../../core/database/database.constants.js';
import type { DatabaseConnection } from '../../../core/database/database.types.js';
import type { CreateItemInput, UpdateItemInput } from '@ember/contracts';
import type { Item } from '../entities/item.entity.js';
import { uuidv7 } from '../../../common/utils/uuid.util.js';
import type { ItemRepository } from './item.repository.js';

/**
 * Drizzle implementation, valid for every provider: ids (UUID v7, so they sort
 * by creation time) and timestamps are generated here and rows re-read after writes, because MySQL has no `RETURNING`.
 */
@Injectable()
export class DrizzleItemRepository implements ItemRepository {
  constructor(
    @Inject(DATABASE) private readonly connection: DatabaseConnection,
  ) {}

  private get db() {
    return this.connection.db;
  }

  private get items() {
    return this.connection.schema.items;
  }

  async findAll(page: number, limit: number) {
    const [rows, [{ total }]] = await Promise.all([
      this.db
        .select()
        .from(this.items)
        .orderBy(asc(this.items.id))
        .limit(limit)
        .offset((page - 1) * limit),
      this.db.select({ total: count() }).from(this.items),
    ]);
    return { items: rows, meta: { page, limit, total } };
  }

  async findById(id: string): Promise<Item | null> {
    const [row] = await this.db
      .select()
      .from(this.items)
      .where(eq(this.items.id, id))
      .limit(1);
    return row ?? null;
  }

  async create(input: CreateItemInput): Promise<Item> {
    const now = new Date();
    const item: Item = {
      id: uuidv7(),
      name: input.name,
      description: input.description ?? null,
      createdAt: now,
      updatedAt: now,
    };
    await this.db.insert(this.items).values(item);
    return item;
  }

  async update(id: string, input: UpdateItemInput): Promise<Item | null> {
    // Only keys sent by the client: `undefined` means "leave unchanged".
    const changes = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    ) as Partial<Pick<Item, 'name' | 'description'>>;
    await this.db
      .update(this.items)
      .set({ ...changes, updatedAt: new Date() })
      .where(eq(this.items.id, id));
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    if (!(await this.findById(id))) return false;
    await this.db.delete(this.items).where(eq(this.items.id, id));
    return true;
  }
}
