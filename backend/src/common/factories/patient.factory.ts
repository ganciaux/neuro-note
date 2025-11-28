import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { Patient } from '../../modules/patients/entities/patient.entity';
import { AddressFactory } from './address.factory';
import { PATIENT_TITLES } from './enum-values';
import { sanitize } from '../../common/utils/sanitize.utils';
import { CreatePatientDto } from 'src/modules/patients/dto/create-patient.dto';
import { UpdatePatientDto } from 'src/modules/patients/dto/update-patient.dto';
import { PatientResponseDto } from 'src/modules/patients/dto/patient-response.dto';

export const PatientFactory = {
  makeEntity: (overrides?: Partial<Patient>, withAddresses = true): Patient => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const base = new Patient();
    base.id = faker.string.uuid();
    base.titleCode = PATIENT_TITLES.MR;
    base.firstName = firstName;
    base.lastName = lastName;
    base.searchName = sanitize(`${firstName}${lastName}`);
    base.birthDate = faker.date.birthdate({ min: 18, max: 90, mode: 'age' });
    base.phone = faker.phone.number();
    base.email = faker.internet.email();
    base.createdAt = new Date();
    base.updatedAt = new Date();
    base.deletedAt = undefined;
    base.slug = `${slugify(lastName, { lower: true })}-${nanoid(4)}`;
    base.addresses = withAddresses ? [AddressFactory.makeEntity({ entityId: base.id })] : [];

    if (overrides) {
      Object.assign(base, overrides);
    }

    return base;
  },

  makeCreateDto: (overrides?: Partial<CreatePatientDto>): CreatePatientDto => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const base: CreatePatientDto = {
      titleCode: PATIENT_TITLES.MR,
      firstName,
      lastName,
      birthDate: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
      phone: faker.phone.number(),
      email: faker.internet.email(),
    };

    return { ...base, ...overrides };
  },

  makeUpdateDto: (overrides?: Partial<UpdatePatientDto>): UpdatePatientDto => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const base: UpdatePatientDto = {
      firstName,
      lastName,
      phone: faker.phone.number(),
      email: faker.internet.email(),
    };

    return { ...base, ...overrides };
  },

  makeResponseDto: (overrides?: Partial<PatientResponseDto>): PatientResponseDto => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const base: PatientResponseDto = {
      id: faker.string.uuid(),
      titleCode: PATIENT_TITLES.MR,
      firstName,
      lastName,
      birthDate: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      slug: `${slugify(lastName, { lower: true })}-${nanoid(4)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      addresses: [],
    };

    return { ...base, ...overrides };
  },
};
