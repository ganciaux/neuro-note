import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../src/data-source';
import { Patient } from '../src/modules/patients/entities/patient.entity';
import { User } from '../src/modules/users/entities/user.entity';
import { Address } from '../src/modules/addresses/entities/address.entity';
import { Service, ServiceItem } from '../src/modules/services/entities/service.entity';
import { ServiceFactory } from '../src/common/factories/service.factory';

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
  await AppDataSource.getRepository(Service).query(`TRUNCATE TABLE "services" CASCADE;`);

  console.log('🗑️ delete addresses, users, services and patients');

  const patients: Patient[] = [];
  const users: User[] = [];
  const addresses: Address[] = [];
  const services: Service[] = [];

  // ======================
  // PATIENTS
  // ======================
  for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });

    const patient = patientRepo.create({
      firstName,
      lastName,
      titleCode: faker.helpers.arrayElement([
        'patient_title_mr',
        'patient_title_mrs',
        'patient_title_ms',
      ]),
      birthDate: faker.date.birthdate({ min: 1950, max: 2024, mode: 'year' }),
      phone: faker.phone.number({ style: 'international' }),
      email,
    });
    patients.push(patient);
  }

  const savedPatients = await patientRepo.save(patients);

  // ADDRESSES
  for (const patient of savedPatients) {
    const count = faker.number.int({ min: 0, max: 3 });
    for (let j = 0; j < count; j++) {
      const address = addressRepo.create({
        entityType: 'address_entity_patient',
        entityId: patient.id,
        typeCode: faker.helpers.arrayElement(['address_type_home', 'address_type_work']),
        street: faker.location.streetAddress(),
        postalCode: faker.location.zipCode(),
        city: faker.location.city(),
        countryCode: faker.helpers.arrayElement([
          'address_country_lu',
          'address_country_fr',
          'address_country_be',
        ]),
        label: faker.lorem.words(2),
      });
      addresses.push(address);
    }
  }

  // ======================
  // USERS
  // ======================
  const roles = ['user_role_admin', 'user_role_staff'];
  const hashedPassword = await bcrypt.hash('12345678', 10);

  for (let i = 0; i < 5; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });

    const user = userRepo.create({
      email,
      passwordHash: hashedPassword,
      firstName: `${firstName}`,
      lastName: `${lastName}`,
      userName: faker.internet.username(),
      roleCode: faker.helpers.arrayElement(roles),
    });
    users.push(user);
  }

  const savedUsers = await userRepo.save(users);

  // ADDRESSES
  for (const user of savedUsers) {
    const count = faker.number.int({ min: 0, max: 3 });
    for (let j = 0; j < count; j++) {
      const address = addressRepo.create({
        entityType: 'address_entity_user',
        entityId: user.id,
        typeCode: faker.helpers.arrayElement(['address_type_home', 'address_type_work']),
        street: faker.location.streetAddress(),
        postalCode: faker.location.zipCode(),
        city: faker.location.city(),
        countryCode: faker.helpers.arrayElement([
          'address_country_lu',
          'address_country_fr',
          'address_country_be',
        ]),
        label: faker.lorem.words(2),
      });
      addresses.push(address);
    }
  }

  await addressRepo.save(addresses);

  // ======================
  // SERVICES & SERVICE ITEMS
  // ======================
  const TOTAL_SERVICES = 20;
  const MAX_ITEMS_PER_BUNDLE = 5;

  for (let i = 0; i < TOTAL_SERVICES; i++) {
    const itemsCount = faker.datatype.boolean()
      ? faker.number.int({ min: 1, max: MAX_ITEMS_PER_BUNDLE })
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
  console.log(`✅ ${services.length} services (et items) saved`);

  await AppDataSource.destroy();
}

seedFakeData().catch(console.error);
