import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnumType } from '../../modules/enum-types/entities/enum-type.entity';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class FilterEnumConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(EnumType)
    private readonly enumTypeRepo: Repository<EnumType>,
  ) {}

  async validate(obj: any, args: ValidationArguments) {
    if (!obj?.value) return false;

    const [expectedType] = args.constraints as [string];

    const found = await this.enumTypeRepo.findOne({
      where: { code: obj.value, type: expectedType },
    });

    return !!found;
  }

  defaultMessage(args: ValidationArguments) {
    const [expectedType] = args.constraints as [string];
    return `'${args.value?.value}' is not a valid code of type '${expectedType}'`;
  }
}

export function FilterEnum(type: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [type],
      validator: FilterEnumConstraint,
    });
  };
}
