// test/e2e/jest-e2e-utils.ts
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppTestModule } from './app-test.module';
import { AuthFactory } from '../factories/auth.factory';
import { AuthFactoryResult } from '../types/auth-factory.types';
import { UsersService } from '../../src/modules/users/services/users.service';
import { AuthService } from '../../src/modules/auth/services/auth.service';

export const API_PREFIX = process.env.API_PREFIX || '/api/v1';

export class E2ETestContext {
  private static _instance: E2ETestContext;

  public app?: INestApplication;
  public admin?: AuthFactoryResult;
  public user?: AuthFactoryResult;

  private constructor() {}

  public static get instance(): E2ETestContext {
    if (!this._instance) {
      this._instance = new E2ETestContext();
    }
    return this._instance;
  }

  public async setup(): Promise<void> {
    if (!this.app) {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppTestModule],
      }).compile();

      this.app = moduleFixture.createNestApplication();
      this.app.setGlobalPrefix(API_PREFIX);
      await this.app.init();

      const usersService = this.app.get(UsersService);
      const authService = this.app.get(AuthService);

      this.admin = await AuthFactory.admin(usersService, authService);
      this.user = await AuthFactory.user(usersService, authService);
    }
  }

  public async close(): Promise<void> {
    if (this.app) {
      await this.app.close();
      this.app = undefined;
      this.admin = undefined;
      this.user = undefined;
    }
  }
}
