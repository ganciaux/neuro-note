// test/unit/users/users.service.spec.ts
import { testBaseService } from '../mocks/service-test-helper';
import { UsersService } from '../../../src/modules/users/services/users.service';
import { User } from '../../../src/modules/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

const exampleUser: Partial<User> = {
  id: uuidv4(),
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  passwordHash: '12345678',
  roleCode: 'admin',
  userName: 'johndoe',
  slug: 'john-doe-0000',
  role: { code: 'admin', label: 'Admin' } as any,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const updatedUser: Partial<User> = {
  firstName: 'Jane',
  lastName: 'Doe',
};

describe('UsersService Unit Tests', () => {
  testBaseService<User, UsersService>({
    serviceClass: UsersService,
    entityClass: User,
    exampleEntity: exampleUser as User,
    updatedEntity: updatedUser,
  });
});
