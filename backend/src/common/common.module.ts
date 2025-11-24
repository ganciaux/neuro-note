import { Module } from '@nestjs/common';
import { EntityMapping } from './entities/entity-mapping.entity';
import { EntityMappingHelper } from './helpers/entity-mapping.helper';
import { EntityExistsConstraint } from './validators/entity-exists.validator';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EntityMapping])],
  providers: [EntityMappingHelper, EntityExistsConstraint],
  exports: [EntityMappingHelper, EntityExistsConstraint],
})
export class CommonModule {}
