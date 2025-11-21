import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnumTypesService } from './services/enum-types.service';
import { EnumTypesController } from './controllers/enum-types.controller';
import { EnumType } from './entities/enum-type.entity';
import { IsEnumTypeConstraint } from '../../common/validators/is-enum-type.validator';
import { EnumTypesRepository } from './repositories/enum-types.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EnumType])],
  controllers: [EnumTypesController],
  providers: [EnumTypesService, EnumTypesRepository, IsEnumTypeConstraint],
  exports: [EnumTypesService, EnumTypesRepository, IsEnumTypeConstraint],
})
export class EnumTypesModule {}
