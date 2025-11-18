import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class NotFoundFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    res.status(404).json({
      statusCode: 404,
      message: 'Route not found',
      error: 'Not Found',
    });
  }
}
