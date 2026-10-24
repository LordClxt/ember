import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module.js';
import { createHttpAdapter, setupApp } from '../src/setup-app.js';

const UNKNOWN_ID = '00000000-0000-4000-8000-000000000000';

describe('Ember API (e2e)', () => {
  let app: NestFastifyApplication;
  const http = () => request(app.getHttpServer());
  const createItem = (body: object = { name: 'Ember' }) =>
    http().post('/api/v1/items').send(body).expect(201);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await setupApp(
      moduleFixture.createNestApplication<NestFastifyApplication>(
        createHttpAdapter(),
      ),
    );
    await app.init();
    // Fastify registers routes asynchronously: wait before sending requests.
    await app.getHttpAdapter().getInstance().ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/health', () => {
    return http()
      .get('/api/health')
      .expect(200)
      .expect(({ body }) => expect(body.status).toBe('ok'));
  });

  describe('/api/v1/items', () => {
    it('POST then GET list', async () => {
      const created = await createItem();

      const list = await http().get('/api/v1/items').expect(200);

      expect(list.body.data).toHaveLength(1);
      expect(list.body.data[0].id).toBe(created.body.id);
      expect(list.body.meta).toEqual({ page: 1, limit: 20, total: 1 });
    });

    it('paginates with page and limit', async () => {
      for (const name of ['a', 'b', 'c']) await createItem({ name });

      const { body } = await http()
        .get('/api/v1/items?page=2&limit=2')
        .expect(200);

      expect(body.data.map((i: { name: string }) => i.name)).toEqual(['c']);
      expect(body.meta).toEqual({ page: 2, limit: 2, total: 3 });
    });

    it('rejects invalid pagination', () => {
      return http().get('/api/v1/items?page=0&limit=101').expect(400);
    });

    it('rejects invalid payloads', () => {
      return http()
        .post('/api/v1/items')
        .send({ name: '', unknown: true })
        .expect(400);
    });

    it('GET /:id returns the item or 404', async () => {
      const { body: created } = await createItem();

      await http()
        .get(`/api/v1/items/${created.id}`)
        .expect(200)
        .expect(({ body }) => expect(body).toEqual(created));
      await http()
        .get(`/api/v1/items/${UNKNOWN_ID}`)
        .expect(404)
        .expect(({ body }) =>
          expect(body).toMatchObject({
            statusCode: 404,
            path: `/api/v1/items/${UNKNOWN_ID}`,
          }),
        );
    });

    it('GET /:id rejects a non-UUID id', () => {
      return http().get('/api/v1/items/not-a-uuid').expect(400);
    });

    it('PATCH /:id updates only the sent fields', async () => {
      const { body: created } = await createItem({
        name: 'Name',
        description: 'Old',
      });

      const { body } = await http()
        .patch(`/api/v1/items/${created.id}`)
        .send({ description: 'New' })
        .expect(200);

      expect(body).toMatchObject({ name: 'Name', description: 'New' });
    });

    it('PATCH /:id rejects a null or empty name', async () => {
      const { body: created } = await createItem();

      await http()
        .patch(`/api/v1/items/${created.id}`)
        .send({ name: null })
        .expect(400);
      await http()
        .patch(`/api/v1/items/${created.id}`)
        .send({ name: '' })
        .expect(400);
    });

    it('PATCH /:id returns 404 for an unknown item', () => {
      return http()
        .patch(`/api/v1/items/${UNKNOWN_ID}`)
        .send({ name: 'x' })
        .expect(404);
    });

    it('DELETE /:id removes the item, then 404', async () => {
      const { body: created } = await createItem();

      await http().delete(`/api/v1/items/${created.id}`).expect(204);
      await http().get(`/api/v1/items/${created.id}`).expect(404);
      await http().delete(`/api/v1/items/${created.id}`).expect(404);
    });
  });
});
