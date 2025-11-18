import { PartialType } from '@nestjs/mapped-types';
import { CreateEnumTypeDto } from './create-enum-type.dto';

export class UpdateEnumTypeDto extends PartialType(CreateEnumTypeDto) {}
