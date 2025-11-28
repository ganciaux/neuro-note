import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getApp } from '../e2e/jest-e2e-utils';

type RequestOptions = {
  token?: string;
  headers?: Record<string, string>;
};

export const postAndExpect = async <T>(
  url: string,
  payload: any,
  options: RequestOptions = {},
  status: number = HttpStatus.CREATED, // 201
): Promise<T> => {
  const app: INestApplication = await getApp();
  let req = request(app.getHttpServer()).post(url).send(payload).expect(status);

  if (options.token) req = req.set('Authorization', options.token);
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      req = req.set(key, value);
    });
  }

  const res = await req;

  if (!res.body) throw new Error(`Response body is empty for POST ${url}`);
  return res.body as T;
};

export const getAndExpect = async <T>(
  url: string,
  options: RequestOptions = {},
  status: number = HttpStatus.OK, // 200
): Promise<T> => {
  const app: INestApplication = await getApp();
  let req = request(app.getHttpServer()).get(url).expect(status);

  if (options.token) req = req.set('Authorization', options.token);
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      req = req.set(key, value);
    });
  }

  const res = await req;

  if (!res.body) throw new Error(`Response body is empty for GET ${url}`);
  return res.body as T;
};

export const patchAndExpect = async <T>(
  url: string,
  payload: any,
  options: RequestOptions = {},
  status: number = HttpStatus.OK, // 200
): Promise<T> => {
  const app: INestApplication = await getApp();
  let req = request(app.getHttpServer()).patch(url).send(payload).expect(status);

  if (options.token) req = req.set('Authorization', options.token);
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      req = req.set(key, value);
    });
  }

  const res = await req;

  if (!res.body) throw new Error(`Response body is empty for PATCH ${url}`);
  return res.body as T;
};

export const deleteAndExpect = async (
  url: string,
  options: RequestOptions = {},
  status: number = HttpStatus.OK, // 200 par défaut
): Promise<void> => {
  const app: INestApplication = await getApp();
  let req = request(app.getHttpServer()).delete(url).expect(status);

  if (options.token) req = req.set('Authorization', options.token);
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      req = req.set(key, value);
    });
  }

  await req;
};
