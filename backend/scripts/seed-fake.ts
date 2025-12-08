import { faker } from '@faker-js/faker';
import { AppDataSource } from '../src/data-source';
import { Patient } from '../src/modules/patients/entities/patient.entity';
import { User } from '../src/modules/users/entities/user.entity';
import { Address } from '../src/modules/addresses/entities/address.entity';
import { Service } from '../src/modules/services/entities/service.entity';
import { ServiceFactory } from '../src/common/factories/service.factory';
import { UserFactory } from '../src/common/factories/user.factory';
import { PatientFactory } from '../src/common/factories/patient.factory';
import { AddressFactory } from '../src/common/factories/address.factory';
import { ADDRESS_ENTITY } from '../src/common/factories/enum-values';
import { generatePatientSlug } from '../src/common/utils/slug.util';
import { sanitize } from '../src/common/utils/sanitize.utils';

async function seedFakeData() {
  await AppDataSource.initialize();

  const patientRepo = AppDataSource.getRepository(Patient);
  const userRepo = AppDataSource.getRepository(User);
  const addressRepo = AppDataSource.getRepository(Address);
  const serviceRepo = AppDataSource.getRepository(Service);

  // ======================
  // Clean
  // ======================
  await addressRepo.clear();
  await userRepo.clear();
  await patientRepo.clear();
  await serviceRepo.query(`TRUNCATE TABLE "services" CASCADE;`);

  console.log('🗑️ delete addresses, users, services and patients');

  const MAX_USER = 5;
  const MAX_PATIENT = 20;
  const MAX_ADDRESSES_PATIENT = 5;
  const MAX_ADDRESSES_USER = 5;
  const MAX_SERVICES = 20;
  const MAX_SERVICE_ITEMS_BUNDLE = 5;

  const patients: Patient[] = [];
  const users: User[] = [];
  const addresses: Address[] = [];
  const services: Service[] = [];

  // ======================
  // PATIENTS
  // ======================
  for (let i = 0; i < MAX_PATIENT; i++) {
    const patient = patientRepo.create(PatientFactory.makeEntity());
    patients.push(patient);
  }

  const savedPatients = await patientRepo.save(patients);

  // ADDRESSES
  for (const patient of savedPatients) {
    const count = faker.number.int({ min: 0, max: MAX_ADDRESSES_PATIENT });
    for (let j = 0; j < count; j++) {
      const address = addressRepo.create(
        AddressFactory.makeEntity({
          entityType: ADDRESS_ENTITY.PATIENT,
          entityId: patient.id,
        }),
      );
      addresses.push(address);
    }
  }

  // ======================
  // USERS
  // ======================
  for (let i = 0; i < MAX_USER; i++) {
    const user = userRepo.create(UserFactory.makeEntityForCreate());
    users.push(user);
  }

  const savedUsers = await userRepo.save(users);

  // ADDRESSES
  for (const user of savedUsers) {
    const count = faker.number.int({ min: 0, max: MAX_ADDRESSES_USER });
    for (let j = 0; j < count; j++) {
      const address = addressRepo.create(
        AddressFactory.makeEntity({
          entityType: ADDRESS_ENTITY.USER,
          entityId: user.id,
        }),
      );
      addresses.push(address);
    }
  }

  await addressRepo.save(addresses);

  // ======================
  // SERVICES & SERVICE ITEMS
  // ======================
  for (let i = 0; i < MAX_SERVICES; i++) {
    const itemsCount = faker.datatype.boolean()
      ? faker.number.int({ min: 1, max: MAX_SERVICE_ITEMS_BUNDLE })
      : 0;

    const service = ServiceFactory.makeEntity(undefined, itemsCount);

    if (service.isBundle && service.items) {
      for (let j = 0; j < service.items.length; j++) {
        const linkedService = ServiceFactory.makeEntity();
        services.push(linkedService);

        service.items[j].service = linkedService;
        service.items[j].serviceId = linkedService.id;
        service.items[j].bundle = service;
        service.items[j].bundleId = service.id;
      }
    }

    services.push(service);
  }

  await serviceRepo.save(services);

  console.log(`✅ ${savedPatients.length} patients saved`);
  console.log(`✅ ${savedUsers.length} users saved`);
  console.log(`✅ ${addresses.length} adresses saved`);
  console.log(`✅ ${services.length} services (and items) saved`);

  await AppDataSource.destroy();
}

seedFakeData().catch(console.error);
