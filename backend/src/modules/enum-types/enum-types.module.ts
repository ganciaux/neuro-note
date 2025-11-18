import { Module } from '@nestjs/common';
import { EnumTypesService } from './enum-types.service';
import { EnumTypesController } from './enum-types.controller';

@Module({
  controllers: [EnumTypesController],
  providers: [EnumTypesService],
})
export class EnumTypesModule {}
