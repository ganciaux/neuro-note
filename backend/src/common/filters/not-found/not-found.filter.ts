import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof NotFoundException) {
      res.status(404).json({
        statusCode: 404,
        message: 'Route not found',
        error: 'Not Found',
      });
      return;
    }

    throw exception;
  }
}
