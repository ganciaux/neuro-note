import { HttpStatus } from '@nestjs/common';
import { API_PREFIX, E2ETestContext } from '../e2e/jest-e2e-utils';
import { assertedGet } from '../../test/utils/request-helpers';

describe('App E2E', () => {
  const ctx = E2ETestContext.instance;

  beforeAll(async () => {
    await ctx.setup();
  });

  afterAll(async () => {
    await ctx.close();
  });

  it(`GET ${API_PREFIX} (hello world!)`, async () => {
    const res = await assertedGet<string>(`${API_PREFIX}`, {}, HttpStatus.OK);
    expect(res).toContain('Hello World!');
  });
});
