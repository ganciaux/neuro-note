// test/utils/e2e-setup.ts
import { E2ETestContext } from '../e2e/jest-e2e-utils';
import { AuthFactoryResult } from '../types/auth-factory.types';

export type E2ETestHelpers = {
  ctx: E2ETestContext;
  admin: AuthFactoryResult;
  user: AuthFactoryResult;
};

export async function useE2ETestHelpers(): Promise<E2ETestHelpers> {
  const ctx = E2ETestContext.instance;
  await ctx.setup();

  if (!ctx.admin || !ctx.user) {
    throw new Error('Admin or user not initialized in E2ETestContext');
  }

  return {
    ctx,
    admin: ctx.admin,
    user: ctx.user,
  };
}

export function describeE2E(title: string, callback: (getHelpers: () => E2ETestHelpers) => void) {
  describe(title, () => {
    const ctx = E2ETestContext.instance;
    let helpers: E2ETestHelpers;

    beforeAll(async () => {
      await ctx.setup();
      helpers = { ctx, admin: ctx.admin!, user: ctx.user! };
    });

    afterAll(async () => {
      await ctx.close();
    });

    callback(() => helpers);
  });
}
