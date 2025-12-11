import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { BaseController } from '../../../common/base/base.controller';
import { toDto } from '../../../common/utils/transform-to-dto';
import { Patient } from '../entities/patient.entity';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { PatientResponseDto } from '../dto/patient-response.dto';
import { PatientsService } from '../services/patients.service';
import { FilterPatientDto } from '../dto/filter-patient.dto';
import { JwtUser } from '../../../modules/auth/models';
import { PermissionActions } from '../../../common/types/permissions.types';
import { UsePermission } from '../../../common/decorators/use-permission.decorator';

export type PatientPermissionActions = PermissionActions | 'findOneExtended';

@Controller('patients')
export class PatientsController extends BaseController<
  Patient,
  PatientResponseDto,
  CreatePatientDto,
  UpdatePatientDto
> {
  protected readonly createDtoClass = CreatePatientDto;
  protected readonly updateDtoClass = UpdatePatientDto;
  protected readonly responseDtoClass = PatientResponseDto;

  protected static permissions: Record<
    PermissionActions,
    (user: JwtUser, request?: any) => boolean
  > = {
    create: (user: JwtUser) => true,
    findAll: (user: JwtUser) => true,
    count: (user: JwtUser) => false,
    findDeleted: (user: JwtUser) => false,
    search: (user: JwtUser) => false,
    softDelete: (user: JwtUser) => false,
    restore: (user: JwtUser) => false,
    findOne: (user: JwtUser) => false,
    update: (user: JwtUser) => false,
    delete: (user: JwtUser) => false,
    findOneExtended: (user: JwtUser) => true,
  };

  constructor(private readonly patientsService: PatientsService) {
    super(patientsService);
  }

  @Get('details/:id')
  @UsePermission('findOneExtended')
  findOneExtended(@Param('id', new ParseUUIDPipe()) id: string): Promise<PatientResponseDto> {
    return this.patientsService.findOneExtended(id);
  }

  @Get('search')
  async searchPatients(@Query() query: FilterPatientDto) {
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
