import { faker } from '@faker-js/faker';
import { User } from '../../modules/users/entities/user.entity';
import { CreateUserDto } from '../../modules/users/dto/create-user.dto';
import { UpdateUserDto } from '../../modules/users/dto/update-user.dto';
import { UserResponseDto } from '../../modules/users/dto/user-response.dto';
import { generateSlug } from '../../common/utils/slug.util';
import { USER_ROLES } from './enum-values';

export const UserFactory = {
  makeEntity: (overrides?: Partial<User>): User => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const userName = faker.internet.username();

    const base: User = {
      id: faker.string.uuid(),
      email: faker.internet.email().toLowerCase(),
      firstName,
      lastName,
      userName,
      roleCode: USER_ROLES.ADMIN,
      role: undefined,
      slug: generateSlug(`${firstName}-${lastName}`),

      passwordHash: '$2b$10$abcdefghijklmnopqrstuv12345678901234567890123456789',

      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
    };

    return { ...base, ...overrides };
  },

  makeCreateDto: (overrides?: Partial<CreateUserDto>): CreateUserDto => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const base: CreateUserDto = {
      email: `${faker.string.uuid()}_${faker.internet.email().toLowerCase()}`,
      firstName,
      lastName,
      password: '12345678',
      userName: faker.internet.username().toLowerCase(),
      roleCode: USER_ROLES.ADMIN,
    };

    return { ...base, ...overrides };
  },

  makeUpdateDto: (overrides?: Partial<UpdateUserDto>): UpdateUserDto => {
    const base: UpdateUserDto = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      userName: faker.internet.username().toLowerCase(),
      roleCode: USER_ROLES.ADMIN,
      //email
    };

    return { ...base, ...overrides };
  },

  makeResponseDto: (overrides?: Partial<UserResponseDto>): UserResponseDto => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const base: UserResponseDto = {
      id: faker.string.uuid(),
      email: faker.internet.email().toLowerCase(),
      firstName,
      lastName,
      userName: faker.internet.username().toLowerCase(),
      roleCode: USER_ROLES.ADMIN,
      slug: generateSlug(`${firstName}-${lastName}`),
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
