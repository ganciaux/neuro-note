import { Logger } from '@nestjs/common';

const logger = new Logger('AppError'); // tu peux changer le context global ici

export interface LogErrorPayload {
  [key: string]: any;
}

export function logError(exception: unknown, context: string, payload?: LogErrorPayload) {
  const status: string | number | undefined = 'UNKNOWN';
  let message: string = exception;
  let stack: string | null = null;

  if (exception instanceof Error) {
    message = exception.message;
    stack = exception.stack ?? null;
  }

  const logPayload = {
    status,
    message,
    payload: payload || {},
    stack,
    timestamp: new Date().toISOString(),
  };

  logger.error(`Error [${status}]`, JSON.stringify(logPayload, null, 2), context);
}
