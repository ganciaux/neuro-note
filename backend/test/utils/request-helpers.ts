import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getApp } from '../../test/e2e/jest-e2e-utils';

export async function assertedGet(url: string, expected: number) {
  const app: INestApplication = await getApp();
  const res = await request(app.getHttpServer()).get(url);
  expect(res.status).toBe(expected);
  return res;
}

export async function assertedPost(url: string, body: any, expected: number) {
  const app: INestApplication = await getApp();
  const res = await request(app.getHttpServer()).post(url).send(body);
  expect(res.status).toBe(expected);
  return res;
}

export async function assertedPatch(url: string, body: any, expected: number) {
  const app: INestApplication = await getApp();
  const res = await request(app.getHttpServer()).patch(url).send(body);
  expect(res.status).toBe(expected);
  return res;
}

export async function assertedDelete(url: string, expected: number) {
  const app: INestApplication = await getApp();
  const res = await request(app.getHttpServer()).delete(url);
  expect(res.status).toBe(expected);
  return res;
}
