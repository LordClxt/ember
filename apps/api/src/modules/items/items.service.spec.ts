import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service.js';
import { InMemoryItemsRepository } from './repositories/in-memory-items.repository.js';
import { ITEMS_REPOSITORY } from './repositories/items.repository.js';

describe('ItemsService', () => {
  let service: ItemsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ItemsService,
        { provide: ITEMS_REPOSITORY, useClass: InMemoryItemsRepository },
      ],
    }).compile();

    service = moduleRef.get(ItemsService);
  });

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
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(service.remove('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
