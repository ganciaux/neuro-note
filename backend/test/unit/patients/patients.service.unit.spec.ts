import { PatientsService } from '../../../src/modules/patients/services/patients.service';
import { createPatientsRepositoryMock } from '../mocks/patient-repository.mock';
import { createAddressesRepositoryMock } from '../mocks/address-repository.mock';
import { PatientsRepository } from '../../../src/modules/patients/repositories/patients.repository';
import { AddressesRepository } from '../../../src/modules/addresses/repositories/addresses.repository';
import { PatientFactory } from '../../../src/common/factories/patient.factory';
import { toDto } from '../../../src/common/utils/transform-to-dto';
import { PatientResponseDto } from '../../../src/modules/patients/dto/patient-response.dto';
import { createServiceTestModule } from '../mocks/service-test-helper';
import { sanitize } from '../../../src/common/utils/sanitize.utils';
import { AddressesService } from '../../../src/modules/addresses/services/addresses.service';
import { generateSlug } from '../../../src/common/utils/slug.util';

describe('PatientsService Unit Tests', () => {
  let service: PatientsService;
  let patientRepositoryMock: any;
  let addressesRepositoryMock: any;

  beforeEach(async () => {
    patientRepositoryMock = createPatientsRepositoryMock();
    addressesRepositoryMock = createAddressesRepositoryMock();

    ({ service } = await createServiceTestModule(PatientsService, [
      { provide: PatientsRepository, useValue: patientRepositoryMock },
      { provide: AddressesService, useValue: AddressesService },
      { provide: AddressesRepository, useValue: addressesRepositoryMock },
    ]));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(patientRepositoryMock).toBeDefined();
  });

  it('should create a patient successfully', async () => {
    const date = new Date();
    const id = 'generated-uuid-123';
    const dto = PatientFactory.makeCreateDto();
    const slug = generateSlug(`${dto.firstName}-${dto.lastName}`);
    const expectedSearchName = sanitize(`${dto.firstName}${dto.lastName}`);

    const entityForCreate = PatientFactory.makeEntityForCreate({
      ...dto,
      slug,
      searchName: expectedSearchName,
    });

    const savedEntity = PatientFactory.makeEntity({
      ...entityForCreate,
      id,
      createdAt: date,
      updatedAt: date,
    });

    (patientRepositoryMock.create as jest.Mock).mockReturnValue(entityForCreate);
    (patientRepositoryMock.save as jest.Mock).mockResolvedValue(savedEntity);

    const result = await service.create(dto);

    expect(patientRepositoryMock.create).toHaveBeenCalled();
    expect(patientRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        ...dto,
        slug,
        searchName: expectedSearchName,
      }),
    );

    expect(result.id).toBe(id);
    expect(result.email).toBe(dto.email);
    expect(result).toEqual(toDto(PatientResponseDto, savedEntity));
  });

  it('should update a patient successfully', async () => {
    const id = 'generated-uuid-123';
    const dto = PatientFactory.makeUpdateDto();
    const existingEntity = PatientFactory.makeEntity({ id });

    const savedEntity = {
      ...existingEntity,
      ...dto,
    };

    (patientRepositoryMock.findOne as jest.Mock).mockResolvedValue(existingEntity);
    (patientRepositoryMock.save as jest.Mock).mockResolvedValue(savedEntity);

    const result = await service.update(id, dto);

    expect(patientRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id },
    });

    expect(patientRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        ...dto,
        id,
      }),
    );

    expect(result).toEqual(toDto(PatientResponseDto, savedEntity));
  });
});
