import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { User } from '../../modules/users/entities/user.entity';
import { CreateUserDto } from '../../modules/users/dto/create-user.dto';
import { UpdateUserDto } from '../../modules/users/dto/update-user.dto';
import { UserResponseDto } from '../../modules/users/dto/user-response.dto';
import { generateUserSlug } from '../utils/slug.util';
import { USER_ROLES } from './enum-values';
import { makeFakeEmail } from './email.factory';

export const UserFactory = {
  makeEntity: (overrides?: Partial<User>): User => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const userName = faker.internet.username();
    const password = faker.internet.password();
    const passwordHash: string = bcrypt.hashSync(password, 10);

    const base: User = {
      id: faker.string.uuid(),
      email: makeFakeEmail(firstName, lastName),
      firstName,
      lastName,
      userName,
      roleCode: faker.helpers.arrayElement(Object.values(USER_ROLES)),
      role: undefined,
      slug: generateUserSlug({ firstName, lastName }),
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
    };

    return { ...base, ...overrides };
  },

  makeEntityWithoutPassword: (overrides?: Partial<User>): Omit<User, 'passwordHash'> => {
    const user = UserFactory.makeEntity(overrides);
    const { passwordHash, ...rest } = user;
    return rest;
  },

  makeEntityForCreate: (
    overrides?: Partial<User>,
  ): Omit<User, 'id' | 'createdAt' | 'updatedAt'> => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const userName = faker.internet.username();
    const password = faker.internet.password();
    const passwordHash: string = bcrypt.hashSync(password, 10);

    const base = {
      email: makeFakeEmail(firstName, lastName),
      firstName,
      lastName,
      userName,
      roleCode: faker.helpers.arrayElement(Object.values(USER_ROLES)),
      role: undefined,
      slug: generateUserSlug({ firstName, lastName }),
      passwordHash,
      deletedAt: undefined,
    };

    return { ...base, ...overrides } as Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
  },

  makeCreateDto: (overrides?: Partial<CreateUserDto>): CreateUserDto => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const base: CreateUserDto = {
      email: makeFakeEmail(firstName, lastName),
      firstName,
      lastName,
      password: faker.internet.password(),
      userName: faker.internet.username().toLowerCase(),
      roleCode: faker.helpers.arrayElement(Object.values(USER_ROLES)),
    };

    return { ...base, ...overrides };
  },

  makeUpdateDto: (overrides?: Partial<UpdateUserDto>): UpdateUserDto => {
    const base: UpdateUserDto = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      userName: faker.internet.username().toLowerCase(),
      roleCode: faker.helpers.arrayElement(Object.values(USER_ROLES)),
      //email
    };

    return { ...base, ...overrides };
  },

  makeResponseDto: (overrides?: Partial<UserResponseDto>): UserResponseDto => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const base: UserResponseDto = {
      id: faker.string.uuid(),
      email: makeFakeEmail(firstName, lastName),
      firstName,
      lastName,
      userName: faker.internet.username().toLowerCase(),
      roleCode: faker.helpers.arrayElement(Object.values(USER_ROLES)),
      slug: generateUserSlug({ firstName, lastName }),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return { ...base, ...overrides };
  },

  makeSearchDto: (overrides = {}) => {
    return {
      page: 1,
      limit: 10,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      userName: undefined,
      ...overrides,
    };
  },
};
