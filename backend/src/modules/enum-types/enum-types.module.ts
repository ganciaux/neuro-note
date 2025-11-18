import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnumTypesService } from './enum-types.service';
import { EnumTypesController } from './enum-types.controller';
import { EnumType } from './entities/enum-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnumType])],
  controllers: [EnumTypesController],
  providers: [EnumTypesService],
})
export class EnumTypesModule {}
