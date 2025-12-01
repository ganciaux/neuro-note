import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { E2ETestContext } from '../e2e/jest-e2e-utils';

export type RequestOptions = {
  token?: string;
  headers?: Record<string, string>;
};

async function performRequest<T>(
  method: 'get' | 'post' | 'patch' | 'delete',
  url: string,
  payload: any,
  expectedStatus: HttpStatus,
  options: RequestOptions,
): Promise<T> {
  const app = E2ETestContext.instance.app;
  if (!app) {
    throw new Error('App is not initialized. Call E2ETestContext.instance.setup() first.');
  }

  let req = request(app.getHttpServer())[method](url);

  if (options.token) {
    req = req.set(
      'Authorization',
      options.token.startsWith('Bearer ') ? options.token : `Bearer ${options.token}`,
    );
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

  if (expectedStatus === HttpStatus.NO_CONTENT) {
    return undefined as unknown as T;
  }

  const contentType = res.header['content-type'] || '';

  if (contentType.includes('application/json')) {
    if (!res.body) {
      throw new Error(`Missing JSON body for ${method.toUpperCase()} ${url}`);
    }
    return res.body as T;
  } else if (contentType.startsWith('text/')) {
    if (!res.text) {
      throw new Error(`Missing text body for ${method.toUpperCase()} ${url}`);
    }
    return res.text as unknown as T;
  } else {
    return undefined as unknown as T;
  }
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
  status = HttpStatus.NO_CONTENT,
): Promise<void> => performRequest<void>('delete', url, null, status, options);
