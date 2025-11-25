import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as qs from 'qs';

@Injectable()
export class QueryParsePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') return value;

    if (typeof value === 'object') {
      const queryString = qs.stringify(value);
      return qs.parse(queryString);
    }

    return value;
  }
}
