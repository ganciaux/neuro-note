import request from 'supertest';
import { getApp, closeApp } from './jest-e2e-utils';

describe('Users E2E', () => {
  let app;

  beforeAll(async () => {
    app = await getApp();
  });

  afterAll(async () => {
    await closeApp();
  });

  it('GET /users', async () => {
    const res = await request(app.getHttpServer()).get(`${process.env.API_PREFIX}/users`);
    expect(res.status).toBe(200);
  });
});
