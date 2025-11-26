import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppTestModule } from './app-test.module';

describe('App E2E', () => {
  let app: INestApplication;
  const API_PREFIX = process.env.API_PREFIX || '/api/v1';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppTestModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix(API_PREFIX);

    await app.init();
  }, 30000);

  afterAll(async () => {
    if (app) await app.close();
  });

  it(`GET ${API_PREFIX} (hello world!)`, async () => {
    const res = await request(app.getHttpServer()).get(`${API_PREFIX}`);
    expect(res.status).toBe(200);
    expect(res.text).toContain('Hello World!');
  });
});
