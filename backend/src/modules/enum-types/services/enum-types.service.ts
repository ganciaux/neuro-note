import { Injectable } from '@nestjs/common';
import { CreateEnumTypeDto } from '../dto/create-enum-type.dto';
import { UpdateEnumTypeDto } from '../dto/update-enum-type.dto';

@Injectable()
export class EnumTypesService {
  create(createEnumTypeDto: CreateEnumTypeDto) {
    return 'This action adds a new enumType';
  }

  findAll() {
    return `This action returns all enumTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enumType`;
  }

  update(id: number, updateEnumTypeDto: UpdateEnumTypeDto) {
    return `This action updates a #${id} enumType`;
  }

  remove(id: number) {
    return `This action removes a #${id} enumType`;
  }
}
