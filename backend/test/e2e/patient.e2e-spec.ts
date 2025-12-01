import { HttpStatus } from '@nestjs/common';
import { PatientFactory } from '../../src/common/factories/patient.factory';
import { PatientResponseDto } from '../../src/modules/patients/dto/patient-response.dto';
import { assertedPost } from '../../test/utils/request-helpers';
import { describeE2E } from './e2e-setup';
import { API_PREFIX } from '../e2e/jest-e2e-utils';

describeE2E('Users E2E', (getHelpers) => {
  it('should create a patient', async () => {
    const { admin } = getHelpers();
    const patientDto = PatientFactory.makeCreateDto();

    const patient = await assertedPost<PatientResponseDto>(
      `${API_PREFIX}/patients`,
      { ...patientDto },
      { token: admin.bearer },
      HttpStatus.CREATED,
    );

    expect(patient.id).toBeDefined();
    expect(patient.firstName).toEqual(patientDto.firstName);
    expect(patient.lastName).toEqual(patientDto.lastName);
    expect(patient.slug).toBeDefined();
  });
});
