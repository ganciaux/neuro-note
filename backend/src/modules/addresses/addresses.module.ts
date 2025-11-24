import { Module } from '@nestjs/common';
import { AddressesService } from './services/addresses.service';
import { AddressesController } from './controllers/addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { EnumType } from '../enum-types/entities/enum-type.entity';
import { EnumTypesModule } from '../enum-types/enum-types.module';
import { AddressesRepository } from './repositories/addresses.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Address, EnumType]), EnumTypesModule],
  controllers: [AddressesController],
  providers: [AddressesService, AddressesRepository],
  exports: [AddressesService, AddressesRepository],
})
export class AddressesModule {}
