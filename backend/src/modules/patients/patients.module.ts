import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsService } from './services/patients.service';
import { PatientsController } from './controllers/patients.controller';
import { Patient } from './entities/patient.entity';
import { PatientsRepository } from './repositories/patients.repository';
import { AddressesRepository } from '../addresses/repositories/addresses.repository';
import { AddressesService } from '../addresses/services/addresses.service';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient]), CommonModule],
  controllers: [PatientsController],
  providers: [PatientsService, PatientsRepository, AddressesRepository, AddressesService],
  exports: [PatientsService, PatientsRepository],
})
export class PatientsModule {}
