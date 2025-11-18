import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnumTypesService } from './enum-types.service';
import { EnumTypesController } from './enum-types.controller';
import { EnumType } from './entities/enum-type.entity';
import { IsEnumTypeConstraint } from '../../common/validators/is-enum-type.validator';

@Module({
  imports: [TypeOrmModule.forFeature([EnumType])],
  controllers: [EnumTypesController],
  providers: [EnumTypesService, IsEnumTypeConstraint],
  exports: [IsEnumTypeConstraint],
})
export class EnumTypesModule {}
