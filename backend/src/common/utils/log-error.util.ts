import { Logger } from '@nestjs/common';

const logger = new Logger('AppError'); // tu peux changer le context global ici

export interface LogErrorPayload {
  [key: string]: any;
}

export function logError(exception: unknown, context: string, payload?: LogErrorPayload) {
  const status = (exception as any)?.status || 'UNKNOWN';
  const message = (exception as any)?.message || exception;
  const stack = (exception as any)?.stack || null;

  const logPayload = {
    status,
    message,
    payload: payload || {},
    stack,
    timestamp: new Date().toISOString(),
  };

  logger.error(`Error [${status}]`, JSON.stringify(logPayload, null, 2), context);
}
