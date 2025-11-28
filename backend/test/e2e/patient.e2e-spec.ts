import { HttpStatus } from '@nestjs/common';
import { closeApp, adminToken, API_PREFIX } from './jest-e2e-utils';
import { PatientFactory } from '../../src/common/factories/patient.factory';
import { PatientResponseDto } from '../../src/modules/patients/dto/patient-response.dto';
import { postAndExpect } from '../../test/utils/app-test.util';

describe('Patient E2E', () => {
  afterAll(async () => {
    await closeApp();
  });

  it('should create a patient', async () => {
    const patientDto = PatientFactory.makeCreateDto();

    const patient = await postAndExpect<PatientResponseDto>(
      `${API_PREFIX}/patients`,
      { ...patientDto },
      { token: adminToken },
      HttpStatus.CREATED,
    );

    expect(patient.id).toBeDefined();
    expect(patient.firstName).toEqual(patientDto.firstName);
    expect(patient.lastName).toEqual(patientDto.lastName);
    expect(patient.slug).toBeDefined();
  });
});
