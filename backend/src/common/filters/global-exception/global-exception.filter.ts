import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

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

  constructor(isDebug: boolean = process.env.NODE_ENV !== 'production') {
    this.isDebug = isDebug;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const traceId = uuidv4();
    let status: number;
    let title: string | object;
    let detail: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      // response peut être string ou object
      if (typeof response === 'string') {
        title = response;
      } else if (typeof response === 'object') {
        title = (response as any).message || exception.message;
        detail = (response as any).message && Array.isArray((response as any).message)
          ? (response as any).message
          : response;
      } else {
        title = exception.message;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      title = 'Internal server error';
      detail = this.isDebug ? { exception } : undefined;
    }

    const payload: ApiErrorResponse = {
      type: 'about:blank',
      title,
      status,
      traceId,
      timestamp: new Date().toISOString(),
      path: req.url,
    };

    if (detail) {
      payload.detail = detail;
      // si debug et qu’il y a un target dans un des éléments
      if (this.isDebug && Array.isArray(detail) && detail.length > 0 && (detail[0] as any).target) {
        payload.detail = {
          target: (detail[0] as any).target,
          errors: detail.map((d: any) => {
            const copy = { ...d };
            delete copy.target;
            return copy;
          }),
        };
      }
    }

    // Log de l'erreur
    this.logger.error(
      `Error [${status}] ${JSON.stringify(payload)}`,
      (exception as any)?.stack,
      'GlobalExceptionFilter',
    );

    res.status(status).json(payload);
  }
}
