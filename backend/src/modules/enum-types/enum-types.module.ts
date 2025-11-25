import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnumTypesService } from './services/enum-types.service';
import { EnumTypesController } from './controllers/enum-types.controller';
import { EnumType } from './entities/enum-type.entity';
import { EnumTypesRepository } from './repositories/enum-types.repository';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([EnumType]), forwardRef(() => CommonModule)],
  controllers: [EnumTypesController],
  providers: [EnumTypesService, EnumTypesRepository],
  exports: [EnumTypesService, EnumTypesRepository],
})
export class EnumTypesModule {}
