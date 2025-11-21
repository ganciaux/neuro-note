import { BadRequestException, ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { logError } from '../utils/log-error.util';

export function CatchTypeOrmError() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await original.apply(this, args);
      } catch (exception) {
        let status: 'CONFLICT' | 'BAD_REQUEST' | 'UNKNOWN' = 'UNKNOWN';
        let message = 'Database error';

        if (exception instanceof QueryFailedError) {
          const errMessage = (exception as any).message || '';
          if (errMessage.toLowerCase().includes('unique constraint')) {
            status = 'CONFLICT';
            message = 'Resource already exists';
          } else {
            status = 'BAD_REQUEST';
            message = errMessage;
          }
        }

        logError(exception, 'CatchTypeOrmError', {
          method: propertyKey,
          message,
        });

        if (status === 'CONFLICT') throw new ConflictException(message);
        if (status === 'BAD_REQUEST') throw new BadRequestException(message);

        throw exception;
      }
    };

    return descriptor;
  };
}
