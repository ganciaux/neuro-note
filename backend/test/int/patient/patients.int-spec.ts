import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommonModule } from '../../../src/common/common.module';
import { setupIntegration } from '../setup-helper';
import { toDto } from '../../../src/common/utils/transform-to-dto';
import { PatientsModule } from '../../../src/modules/patients/patients.module';
import { PatientsService } from '../../../src/modules/patients/services/patients.service';
import { PatientsRepository } from '../../../src/modules/patients/repositories/patients.repository';
import { PatientFactory } from '../../../src/common/factories/patient.factory';
import { PatientResponseDto } from '../../../src/modules/patients/dto/patient-response.dto';

describe('Patients Integration Test', () => {
  let patientsRepository: PatientsRepository;
  let patientsService: PatientsService;

  beforeAll(async () => {
    const setup = await setupIntegration({
      modules: [PatientsModule, CommonModule],
      repository: PatientsRepository,
      service: PatientsService,
    });

    patientsRepository = setup.repository;
    patientsService = setup.service;
  });

  beforeEach(async () => {
    await patientsRepository.clear();
  });

  it('should create a patient', async () => {
    const dto = PatientFactory.makeCreateDto();
    const dtoBefore = { ...dto };
    const created = await patientsService.create(dto);

    expect(created.id).toBeDefined();
    expect(created.email).toBe(dto.email);
    expect(created).toMatchObject({
      ...dtoBefore,
    });

    const userInDb = await patientsRepository.findOneBy({ id: created.id });

    expect(userInDb).not.toBeNull();
    expect(created).toEqual(toDto(PatientResponseDto, userInDb));
  });
});
