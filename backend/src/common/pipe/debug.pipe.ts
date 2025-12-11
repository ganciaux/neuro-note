import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class DebugPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('DebugPipe sees:', value, metadata);
    return value;
  }
}
