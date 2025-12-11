import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logError } from '../../../common/utils/log-error.util';
import { v4 as uuidv4 } from 'uuid';
import { appConfig } from '../../../config';
import { ValidationError } from 'class-validator';

interface ApiErrorResponse {
  type: string;
  title: string | object;
  status: number;
  detail?: any;
  traceId: string;
  timestamp: string;
  path: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private readonly isDebug: boolean;

  constructor(isDebug: boolean = appConfig.isDebug) {
    this.isDebug = isDebug;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    console.log('Exception caught by GlobalExceptionFilter:', exception);
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const traceId = uuidv4();
    let status: number;
    let title: string | object;
    let detail: any;

    if (Array.isArray(exception) && exception.every((e) => e instanceof ValidationError)) {
      status = HttpStatus.BAD_REQUEST;
      title = 'Validation error';
      detail = exception.map((err) => {
        const copy = { ...err };
        delete copy.target;
        return copy;
      });
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        title = response;
      } else if (typeof response === 'object') {
        if (Array.isArray((response as any).message)) {
          detail = (response as any).message;
          title = 'Validation error';
        } else {
          title = (response as any).message || exception.message;
          detail = response;
        }
      } else {
        title = exception.message;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      title = 'Internal server error';
      if (this.isDebug) {
        detail = {
          exception: {
            name: exception?.name,
            message: exception?.message,
            stack: exception?.stack,
          },
        };
      }
    }

    const payload: ApiErrorResponse = {
      type: 'about:blank',
      title,
      status,
      traceId,
      timestamp: new Date().toISOString(),
      path: req.url,
    };

    if (detail && Array.isArray(detail) && detail.length > 0 && detail[0].target) {
      const errors = detail.map((d: any) => {
        const copy = { ...d };
        delete copy.target;
        return copy;
      });

      if (this.isDebug) {
        payload.detail = { target: detail[0].target, errors };
      } else {
        payload.detail = { errors };
      }
    } else if (detail) {
      payload.detail = detail;
    }

    logError(exception, 'GlobalExceptionFilter', {
      payload,
      method: req.method,
      url: req.url,
    });

    res.status(status).json(payload);
  }
}
