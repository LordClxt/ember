import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Item } from './item.model';
import { ItemsApi } from './items.api';
import { ItemsStore } from './items.store';

const item: Item = {
  id: '1',
  name: 'Ember',
  description: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('ItemsStore', () => {
  let store: ItemsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemsStore,
        {
          provide: ItemsApi,
          useValue: {
            list: () => of({ data: [item], meta: { page: 1, limit: 20, total: 1 } }),
            create: () => of({ ...item, id: '2', name: 'New' }),
            remove: () => of(undefined),
          } satisfies Partial<ItemsApi>,
        },
      ],
    });
    store = TestBed.inject(ItemsStore);
  });

  it('loads items', async () => {
    await store.load();
    expect(store.items()).toEqual([item]);
    expect(store.loading()).toBe(false);
  });

  it('adds then removes an item', async () => {
    await store.load();
    await store.add({ name: 'New' });
    expect(store.count()).toBe(2);

    await store.remove('1');
    expect(store.items().map((i) => i.name)).toEqual(['New']);
  });
});
