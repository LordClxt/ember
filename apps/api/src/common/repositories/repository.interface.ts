import type { PaginationMeta } from '@ember/contracts';

/**
 * Generic repository contract. Services depend on this abstraction,
 * so the persistence layer (in-memory, Prisma, TypeORM, Mongo...) can be
 * swapped without touching business code.
 */
export interface Repository<
  T extends { id: string },
  CreateInput,
  UpdateInput,
> {
  findAll(
    page: number,
    limit: number,
  ): Promise<{ items: T[]; meta: PaginationMeta }>;
  findById(id: string): Promise<T | null>;
  create(input: CreateInput): Promise<T>;
  update(id: string, input: UpdateInput): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
