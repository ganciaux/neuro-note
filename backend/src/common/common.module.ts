import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityMapping } from './entities/entity-mapping.entity';
import { EntityMappingHelper } from './helpers/entity-mapping.helper';
import { EntityExistsConstraint } from './validators/entity-exists.validator';
import { IsEnumTypeConstraint } from './validators/is-enum-type.validator';
import { FilterEnumConstraint } from './decorators/filter-enum.decorator';
import { EnumTypesModule } from '../modules/enum-types/enum-types.module';
import { EnumType } from '../modules/enum-types/entities/enum-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityMapping, EnumType]), EnumTypesModule],
  providers: [
    EntityMappingHelper,
    EntityExistsConstraint,
    IsEnumTypeConstraint,
    FilterEnumConstraint,
  ],
  exports: [
    EntityMappingHelper,
    EntityExistsConstraint,
    IsEnumTypeConstraint,
    FilterEnumConstraint,
  ],
})
export class CommonModule {}
