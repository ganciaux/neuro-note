import { AuthService } from '../../src/modules/auth/services/auth.service';
import { UserFactory } from '../../src/common/factories/user.factory';
import { USER_ROLES } from '../../src/common/factories/enum-values';
import { AuthFactoryResult } from '../../test/types/auth-factory.types';
import { UsersService } from '../../src/modules/users/services/users.service';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { faker } from '@faker-js/faker';

export class AuthFactory {
  static async registerAndLogin(
    role: string = USER_ROLES.ADMIN,
    userService?: UsersService,
    authService?: AuthService,
  ): Promise<AuthFactoryResult> {
    if (!userService || !authService) {
      throw new Error('UserService and AuthService must be provided');
    }

    const createUserDto = UserFactory.makeCreateDto({ roleCode: role });
    const user = await userService.create(createUserDto);

    const loginResponse = await authService.login(createUserDto.email, createUserDto.password);

    return {
      user,
      accessToken: loginResponse.accessToken,
      bearer: `Bearer ${loginResponse.accessToken}`,
      loginUser: loginResponse.user,
      credentials: { email: createUserDto.email, password: createUserDto.password },
    };
  }

  static async admin(
    userService: UsersService,
    authService: AuthService,
  ): Promise<AuthFactoryResult> {
    return this.registerAndLogin(USER_ROLES.ADMIN, userService, authService);
  }

  static async user(
    userService: UsersService,
    authService: AuthService,
  ): Promise<AuthFactoryResult> {
    return this.registerAndLogin(USER_ROLES.STAFF, userService, authService);
  }

  static makeRegisterDto(overrides?: Partial<RegisterDto>): RegisterDto {
    const base: RegisterDto = {
      email: `${faker.string.uuid()}_${faker.internet.email().toLowerCase()}`,
      userName: faker.internet.username().toLowerCase(),
      lastName: faker.person.lastName(),
      firstName: faker.person.firstName(),
      password: 'Password123!',
    };

    return { ...base, ...overrides };
  }
}
