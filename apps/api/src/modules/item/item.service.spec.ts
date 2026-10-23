import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DATABASE } from '../../core/database/database.constants.js';
import type { DatabaseConnection } from '../../core/database/database.types.js';
import { createSqliteTestDatabase } from '../../../test/utils/test-database.js';
import { ItemService } from './item.service.js';
import { DrizzleItemRepository } from './repositories/drizzle-item.repository.js';
import { ITEM_REPOSITORY } from './repositories/item.repository.js';

describe('ItemService', () => {
  let service: ItemService;
  let connection: DatabaseConnection;

  beforeEach(async () => {
    connection = await createSqliteTestDatabase();
    const moduleRef = await Test.createTestingModule({
      providers: [
        ItemService,
        { provide: DATABASE, useValue: connection },
        { provide: ITEM_REPOSITORY, useClass: DrizzleItemRepository },
      ],
    }).compile();

    service = moduleRef.get(ItemService);
  });

  afterEach(() => connection.close());

  it('creates and lists items', async () => {
    const created = await service.create({ name: 'Ember' });

    const page = await service.findAll(1, 20);

    expect(created.description).toBeNull();
    expect(page.data).toEqual([created]);
    expect(page.meta).toEqual({ page: 1, limit: 20, total: 1 });
  });

  it('updates an item', async () => {
    const created = await service.create({ name: 'Old' });

    const updated = await service.update(created.id, { name: 'New' });

    expect(updated.name).toBe('New');
  });

  it('throws when the item does not exist', async () => {
    const id = '00000000-0000-4000-8000-000000000000';
    await expect(service.findOne(id)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.update(id, { name: 'x' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(service.remove(id)).rejects.toBeInstanceOf(NotFoundException);
  });
});
