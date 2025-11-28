import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppTestModule } from './app-test.module';
import { UserFactory } from '../../src/common/factories/user.factory';
import { USER_ROLES } from '../../src/common/factories/enum-values';

let app: INestApplication;
export const API_PREFIX = process.env.API_PREFIX || '/api/v1';

export const adminUser = UserFactory.makeEntity({ roleCode: USER_ROLES.ADMIN });
export const adminToken = 'Bearer MOCK_ADMIN_JWT_TOKEN';

export const getApp = async (): Promise<INestApplication> => {
  if (!app) {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppTestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix(API_PREFIX);
    await app.init();
  }
  return app;
};

export const closeApp = async () => {
  if (app) {
    await app.close();
    app = undefined;
  }
};
