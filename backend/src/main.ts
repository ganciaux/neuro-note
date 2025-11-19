import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception/global-exception.filter';
import { appConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
  app.useGlobalFilters(new GlobalExceptionFilter(appConfig.isDebug));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  await app.listen(appConfig.port);
}
bootstrap();
