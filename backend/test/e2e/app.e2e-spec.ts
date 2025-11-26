import request from 'supertest';
import { getApp, closeApp } from './jest-e2e-utils';
import { INestApplication } from '@nestjs/common';

describe('App E2E', () => {
  let app: INestApplication;
  const API_PREFIX = process.env.API_PREFIX || '/api/v1';

  beforeAll(async () => {
    app = await getApp();
  });

  afterAll(async () => {
    await closeApp();
  });

  it(`GET ${API_PREFIX} (hello world!)`, async () => {
    const res = await request(app.getHttpServer()).get(`${API_PREFIX}`);
    expect(res.status).toBe(200);
    expect(res.text).toContain('Hello World!');
  });
});
