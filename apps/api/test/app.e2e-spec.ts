import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { setupApp } from './../src/setup-app.js';

describe('Ember API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = setupApp(moduleFixture.createNestApplication());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/health', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect(({ body }) => expect(body.status).toBe('ok'));
  });

  it('POST then GET /api/v1/items', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/v1/items')
      .send({ name: 'Ember' })
      .expect(201);

    const list = await request(app.getHttpServer())
      .get('/api/v1/items')
      .expect(200);

    expect(list.body.data).toHaveLength(1);
    expect(list.body.data[0].id).toBe(created.body.id);
  });

  it('rejects invalid payloads', () => {
    return request(app.getHttpServer())
      .post('/api/v1/items')
      .send({ name: '', unknown: true })
      .expect(400);
  });
});
