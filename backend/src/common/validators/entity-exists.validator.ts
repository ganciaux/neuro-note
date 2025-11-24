import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityMappingHelper } from '../helpers/entity-mapping.helper';

interface EntityTypeDTO {
  entityType: string;
  entityId: string;
}

@ValidatorConstraint({ async: true })
@Injectable()
export class EntityExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityMappingHelper: EntityMappingHelper) {}

  async validate(entityId: string, args: ValidationArguments): Promise<boolean> {
    const object = args.object as EntityTypeDTO;
    const entityType = object.entityType;
    if (!entityType) return false;
    return await this.entityMappingHelper.exists(entityType, entityId);
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as EntityTypeDTO;
    return `entityId '${args.value}' does not exist for entityType '${object.entityType}'`;
  }
}

export function EntityExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: EntityExistsConstraint,
    });
  };
}
