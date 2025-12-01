import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getApp } from '../e2e/jest-e2e-utils';

export type RequestOptions = {
  token?: string;
  headers?: Record<string, string>;
};

async function performRequest<T>(
  method: 'get' | 'post' | 'patch' | 'delete',
  url: string,
  payload: any,
  expectedStatus: number,
  options: RequestOptions,
): Promise<T> {
  const app: INestApplication = await getApp();
  const http = request(app.getHttpServer());

  let req = http[method](url);

  if (options.token) {
    req = req.set('Authorization', `Bearer ${options.token}`);
  }

  if (options.headers) {
    for (const [k, v] of Object.entries(options.headers)) {
      req = req.set(k, v);
    }
  }

  if (payload) {
    req = req.send(payload);
  }

  const res = await req.expect(expectedStatus);

  if (!('body' in res)) {
    throw new Error(`Missing body for ${method.toUpperCase()} ${url}`);
  }

  return res.body as T;
}

export const assertedGet = <T>(url: string, options: RequestOptions = {}, status = HttpStatus.OK) =>
  performRequest<T>('get', url, null, status, options);

export const assertedPost = <T>(
  url: string,
  payload: any,
  options: RequestOptions = {},
  status = HttpStatus.CREATED,
) => performRequest<T>('post', url, payload, status, options);

export const assertedPatch = <T>(
  url: string,
  payload: any,
  options: RequestOptions = {},
  status = HttpStatus.OK,
) => performRequest<T>('patch', url, payload, status, options);

export const assertedDelete = (
  url: string,
  options: RequestOptions = {},
  status = HttpStatus.OK,
): Promise<void> => performRequest<void>('delete', url, null, status, options);
