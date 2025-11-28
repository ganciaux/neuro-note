import { faker } from '@faker-js/faker';
import { User } from '../../modules/users/entities/user.entity';
import { CreateUserDto } from '../../modules/users/dto/create-user.dto';
import { UpdateUserDto } from '../../modules/users/dto/update-user.dto';
import { UserResponseDto } from '../../modules/users/dto/user-response.dto';
import { generateSlug } from '../../common/utils/slug.util';
import { USER_ROLES } from './enum-values';

export const UserFactory = {
  makeEntity: (overrides?: Partial<User>): User => {
    const base: User = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      passwordHash: '12345678',
      userName: faker.internet.username(),
      roleCode: USER_ROLES.ADMIN,
      role: undefined,
      slug: generateSlug(faker.internet.username()),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
    };
    return { ...base, ...overrides };
  },

  makeCreateDto: (overrides?: Partial<CreateUserDto>): CreateUserDto => ({
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: '12345678',
    userName: faker.internet.username(),
    roleCode: USER_ROLES.ADMIN,
    ...overrides,
  }),

  makeUpdateDto: (overrides?: Partial<UpdateUserDto>): UpdateUserDto => ({
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    userName: faker.internet.username(),
    roleCode: USER_ROLES.ADMIN,
    ...overrides,
  }),

  makeResponseDto: (overrides?: Partial<UserResponseDto>): UserResponseDto => ({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    userName: faker.internet.username(),
    roleCode: USER_ROLES.ADMIN,
    slug: generateSlug(faker.internet.username()),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
};
