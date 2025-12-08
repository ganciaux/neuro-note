import { faker } from '@faker-js/faker';
import { Patient } from '../../modules/patients/entities/patient.entity';
import { AddressFactory } from './address.factory';
import { PATIENT_TITLES } from './enum-values';
import { sanitize } from '../../common/utils/sanitize.utils';
import { CreatePatientDto } from '../../modules/patients/dto/create-patient.dto';
import { UpdatePatientDto } from '../../modules/patients/dto/update-patient.dto';
import { PatientResponseDto } from '../../modules/patients/dto/patient-response.dto';
import { generatePatientSlug } from '../utils/slug.util';
import { makeFakeEmail } from './email.factory';

export const PatientFactory = {
  makeEntity: (overrides?: Partial<Patient>, withAddresses = true): Patient => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const base = new Patient();
    base.id = faker.string.uuid();
    base.titleCode = faker.helpers.arrayElement(Object.values(PATIENT_TITLES));
    base.firstName = firstName;
    base.lastName = lastName;
    base.searchName = sanitize(`${firstName}${lastName}`);
    base.birthDate = faker.date.birthdate({ min: 18, max: 90, mode: 'age' });
    base.phone = faker.phone.number();
    base.email = makeFakeEmail(firstName, lastName);
    base.createdAt = new Date();
    base.updatedAt = new Date();
    base.deletedAt = undefined;
    base.slug = generatePatientSlug({ firstName, lastName });
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
      titleCode: faker.helpers.arrayElement(Object.values(PATIENT_TITLES)),
      firstName,
      lastName,
      birthDate: faker.date.birthdate({ min: 4, max: 90, mode: 'age' }),
      phone: faker.phone.number(),
      email: makeFakeEmail(firstName, lastName),
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
      email: makeFakeEmail(firstName, lastName),
    };

    return { ...base, ...overrides };
  },

  makeResponseDto: (overrides?: Partial<PatientResponseDto>): PatientResponseDto => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const base: PatientResponseDto = {
      id: faker.string.uuid(),
      titleCode: faker.helpers.arrayElement(Object.values(PATIENT_TITLES)),
      firstName,
      lastName,
      birthDate: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
      phone: faker.phone.number(),
      email: makeFakeEmail(firstName, lastName),
      slug: generatePatientSlug({ firstName, lastName }),
      createdAt: new Date(),
      updatedAt: new Date(),
      addresses: [],
    };

    return { ...base, ...overrides };
  },

  makeEntityForCreate: (
    overrides?: Partial<Patient>,
  ): Omit<Patient, 'id' | 'createdAt' | 'updatedAt'> => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const userName = faker.internet.username();

    const base = {
      email: makeFakeEmail(firstName, lastName),
      firstName,
      lastName,
      userName,
      titleCode: faker.helpers.arrayElement(Object.values(PATIENT_TITLES)),
      searchName: sanitize(`${firstName}${lastName}`),
      slug: generatePatientSlug({ firstName, lastName }),
      birthDate: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
      phone: faker.phone.number(),
      deletedAt: undefined,
    };

    return { ...base, ...overrides } as Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;
  },
};
