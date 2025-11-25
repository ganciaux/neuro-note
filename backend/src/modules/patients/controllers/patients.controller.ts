import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { BaseController } from '../../../common/base/base.controller';
import { Patient } from '../entities/patient.entity';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { PatientResponseDto } from '../dto/patient-response.dto';
import { PatientsService } from '../services/patients.service';
import { PatientFilterDto } from '../dto/filter-patient.dto';
import { toDto } from '../../..//common/utils/transform-to-dto';

@Controller('patients')
export class PatientsController extends BaseController<
  Patient,
  PatientResponseDto,
  CreatePatientDto,
  UpdatePatientDto
> {
  protected readonly responseDtoClass = PatientResponseDto;

  constructor(private readonly patientsService: PatientsService) {
    super(patientsService);
  }

  @Get('details/:id')
  findOneExtended(@Param('id', new ParseUUIDPipe()) id: string): Promise<PatientResponseDto> {
    return this.patientsService.findOneExtended(id);
  }

  @Get('search')
  async searchPatients(@Query() query: PatientFilterDto) {
    const [entities, total] = await this.patientsService.search(query);
    return {
      data: entities.map((e) => toDto(PatientResponseDto, e)),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }
}
