import type { DatabaseConnection } from '../../../database/database.types.js';
import {
  createPostgresTestDatabase,
  createSqliteTestDatabase,
} from '../../../../test/utils/test-database.js';
import { DrizzleItemsRepository } from './drizzle-items.repository.js';

describe.each([
  ['sqlite', createSqliteTestDatabase],
  ['postgres', createPostgresTestDatabase],
])('DrizzleItemsRepository (%s)', (_, createDatabase) => {
  let connection: DatabaseConnection;
  let repository: DrizzleItemsRepository;

  beforeEach(async () => {
    connection = await createDatabase();
    repository = new DrizzleItemsRepository(connection);
  });

  afterEach(() => connection.close());

  it('creates, reads and paginates in insertion order', async () => {
    const first = await repository.create({ name: 'First' });
    const second = await repository.create({
      name: 'Second',
      description: 'd',
    });
    await repository.create({ name: 'Third' });

    expect(await repository.findById(first.id)).toEqual(first);
    expect(second.description).toBe('d');

    const page = await repository.findAll(2, 2);
    expect(page.items.map((i) => i.name)).toEqual(['Third']);
    expect(page.meta).toEqual({ page: 2, limit: 2, total: 3 });
  });

  it('updates only the provided fields', async () => {
    const item = await repository.create({ name: 'Name', description: 'Old' });

    const updated = await repository.update(item.id, {
      name: undefined,
      description: 'New',
    });

    expect(updated).toMatchObject({ name: 'Name', description: 'New' });
    expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(
      item.updatedAt.getTime(),
    );
  });

  it('returns null / false for unknown ids', async () => {
    const id = '00000000-0000-4000-8000-000000000000';

    expect(await repository.findById(id)).toBeNull();
    expect(await repository.update(id, { name: 'x' })).toBeNull();
    expect(await repository.delete(id)).toBe(false);
  });

  it('deletes an item', async () => {
    const item = await repository.create({ name: 'Gone' });

    expect(await repository.delete(item.id)).toBe(true);
    expect(await repository.findById(item.id)).toBeNull();
  });
});
