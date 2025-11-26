import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppTestModule } from './app-test.module';

let app: INestApplication;
export const API_PREFIX = process.env.API_PREFIX || '/api/v1';

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
