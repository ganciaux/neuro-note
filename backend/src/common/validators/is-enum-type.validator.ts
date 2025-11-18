import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnumType } from '../../modules/enum-types/entities/enum-type.entity';

@ValidatorConstraint({ async: true })
export class IsEnumTypeConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(EnumType)
    private readonly enumTypeRepo: Repository<EnumType>,
  ) {}

  async validate(value: any, args: ValidationArguments) {
    const expectedType = args.constraints[0];

    if (!value) return false;

    const found = await this.enumTypeRepo.findOne({
      where: { code: value, type: expectedType },
    });

    return !!found;
  }

  defaultMessage(args: ValidationArguments) {
    const expectedType = args.constraints[0];
    return `${args.property} must be a valid code of type '${expectedType}'`;
  }
}

export function IsEnumType(type: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [type],
      validator: IsEnumTypeConstraint,
    });
  };
}
