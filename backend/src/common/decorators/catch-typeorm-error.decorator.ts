import { Logger, BadRequestException, ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

const logger = new Logger('CatchTypeOrmError');

export function CatchTypeOrmError() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        try {
            return await original.apply(this, args);
        } catch (exception) {
            let status = 'UNKNOWN';
            let message = 'Database error';

            if (exception instanceof QueryFailedError) {
            const errMessage = (exception as any).message || '';
            if (errMessage.includes('unique constraint')) {
                status = 'CONFLICT';
                logger.error(`Error [${status}] ${errMessage}`, exception.stack, propertyKey);
                throw new ConflictException('Resource already exists');
            } else {
                status = 'BAD_REQUEST';
                logger.error(`Error [${status}] ${errMessage}`, exception.stack, propertyKey);
                throw new BadRequestException(errMessage);
            }
            } else {
            logger.error(`Unhandled error`, exception.stack, propertyKey);
            throw exception;
            }
        }
    };

    return descriptor;
  };
}
