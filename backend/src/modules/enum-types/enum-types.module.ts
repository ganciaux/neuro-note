import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnumTypesService } from './services/enum-types.service';
import { EnumTypesController } from './controllers/enum-types.controller';
import { EnumType } from './entities/enum-type.entity';
import { IsEnumTypeConstraint } from '../../common/validators/is-enum-type.validator';
import { EnumTypesRepository } from './repositories/enum-types.repository';
import { EntityExistsConstraint } from '../../common/validators/entity-exists.validator';
import { EntityMappingHelper } from '../../common/helpers/entity-mapping.helper';

@Module({
  imports: [TypeOrmModule.forFeature([EnumType])],
  controllers: [EnumTypesController],
  providers: [
    EnumTypesService,
    EnumTypesRepository,
    IsEnumTypeConstraint,
    EntityMappingHelper,
    EntityExistsConstraint,
  ],
  exports: [
    EnumTypesService,
    EnumTypesRepository,
    IsEnumTypeConstraint,
    EntityMappingHelper,
    EntityExistsConstraint,
  ],
})
export class EnumTypesModule {}
