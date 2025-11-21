import { Module } from '@nestjs/common';
import { PatientsService } from './services/patients.service';
import { PatientsController } from './controllers/patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { EnumTypesModule } from '../enum-types/enum-types.module';
import { EnumType } from '../enum-types/entities/enum-type.entity';
import { PatientsRepository } from './repositories/patients.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, EnumType]), EnumTypesModule],
  controllers: [PatientsController],
  providers: [PatientsService, PatientsRepository],
  exports: [PatientsService, PatientsRepository],
})
export class PatientsModule {}
