import { randomUUID } from 'node:crypto';
import type { PaginationMeta } from '../interfaces/paginated.interface.js';
import type { Repository } from './repository.interface.js';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Map-backed repository, handy for prototyping and tests.
 * Replace with a database-backed implementation when you need persistence.
 */
export abstract class InMemoryRepository<
  T extends BaseEntity,
  CreateInput extends object,
  UpdateInput extends object,
> implements Repository<T, CreateInput, UpdateInput> {
  protected readonly store = new Map<string, T>();

  findAll(page: number, limit: number) {
    const all = [...this.store.values()];
    const start = (page - 1) * limit;
    const meta: PaginationMeta = { page, limit, total: all.length };
    return Promise.resolve({ items: all.slice(start, start + limit), meta });
  }

  findById(id: string) {
    return Promise.resolve(this.store.get(id) ?? null);
  }

  /** Default mapping: the input already matches the entity shape. Override when it doesn't. */
  create(input: CreateInput) {
    return this.insert(input as unknown as Omit<T, keyof BaseEntity>);
  }

  update(id: string, input: UpdateInput) {
    const existing = this.store.get(id);
    if (!existing) return Promise.resolve(null);
    const updated: T = Object.assign({}, existing, input, {
      updatedAt: new Date(),
    });
    this.store.set(id, updated);
    return Promise.resolve(updated);
  }

  delete(id: string) {
    return Promise.resolve(this.store.delete(id));
  }

  protected insert(data: Omit<T, keyof BaseEntity>) {
    const now = new Date();
    const entity = Object.assign({}, data, {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    }) as T;
    this.store.set(entity.id, entity);
    return Promise.resolve(entity);
  }
}
