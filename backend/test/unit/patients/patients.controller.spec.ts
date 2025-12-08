import { FilterPatientDto } from '../../../src/modules/patients/dto/filter-patient.dto';
import { PatientsController } from '../../../src/modules/patients/controllers/patients.controller';
import { PatientsService } from '../../../src/modules/patients/services/patients.service';
import { createPatientsServiceMock } from '../mocks/patient-service.mock';
import { PatientFactory } from '../../../src/common/factories/patient.factory';

describe('PatientsController', () => {
  let controller: PatientsController;

  const mockPatientsService = createPatientsServiceMock();

  beforeEach(async () => {
    controller = await createControllerTestModule(
      PatientsController,
      PatientsService,
      mockPatientsService,
    );
  });

  describe('details', () => {
    it('should call service and return patient DTO with details', async () => {
      const patient = PatientFactory.makeEntity();
      mockPatientsService.findOneExtended.mockResolvedValue(patient);
      const result = await controller.findOneExtended(patient.id);
      expect(result).toEqual(patient);
    });
  });

  describe('searchUsers', () => {
    it('should call service and return data with meta', async () => {
      const query: FilterPatientDto = { page: 1, limit: 10 };
      const patient = [PatientFactory.makeResponseDto()];
      const total = 5;
      mockPatientsService.search.mockResolvedValue([patient, total]);

      const result = await controller.searchPatients(query);

      expect(mockPatientsService.search).toHaveBeenCalledWith(query);
      expect(result.data.length).toBe(patient.length);
      expect(result.data[0]).toEqual(expect.objectContaining(patient[0]));
      expect(result.meta).toEqual({ page: query.page, limit: query.limit, total });
    });
  });
});
