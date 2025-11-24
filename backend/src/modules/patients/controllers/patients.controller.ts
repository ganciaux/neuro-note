import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { BaseController } from '../../../common/base/base.controller';
import { Patient } from '../entities/patient.entity';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { PatientResponseDto } from '../dto/patient-response.dto';
import { PatientsService } from '../services/patients.service';

@Controller('patients')
export class PatientsController extends BaseController<
  Patient,
  PatientResponseDto,
  CreatePatientDto,
  UpdatePatientDto
> {
  constructor(private readonly patientsService: PatientsService) {
    super(patientsService);
  }

  @Get(':id/details')
  findOneExtended(@Param('id', new ParseUUIDPipe()) id: string): Promise<PatientResponseDto> {
    return this.patientsService.findOneExtended(id);
  }
}
