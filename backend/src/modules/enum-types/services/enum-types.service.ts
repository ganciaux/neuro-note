import { Injectable } from '@nestjs/common';
import { CreateEnumTypeDto } from '../dto/create-enum-type.dto';
import { UpdateEnumTypeDto } from '../dto/update-enum-type.dto';

@Injectable()
export class EnumTypesService {
  create(_createEnumTypeDto: CreateEnumTypeDto) {
    if (!_createEnumTypeDto) throw new Error('Missing createEnumTypeDto');
    return 'This action adds a new enumType';
  }

  findAll() {
    return `This action returns all enumTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enumType`;
  }

  update(id: number, _updateEnumTypeDto: UpdateEnumTypeDto) {
    if (!_updateEnumTypeDto) throw new Error('Missing updateEnumTypeDto');
    return `This action updates a #${id} enumType`;
  }

  remove(id: number) {
    return `This action removes a #${id} enumType`;
  }
}
