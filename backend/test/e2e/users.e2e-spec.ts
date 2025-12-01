import { HttpStatus } from '@nestjs/common';
import { UserFactory } from '../../src/common/factories/user.factory';
import { UserResponseDto } from '../../src/modules/users/dto/user-response.dto';
import { CreateUserDto } from '../../src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '../../src/modules/users/dto/update-user.dto';
import { assertedGet, assertedPost, assertedPatch, assertedDelete } from '../utils/request-helpers';
import { API_PREFIX } from '../e2e/jest-e2e-utils';
import { describeE2E } from './e2e-setup';
import { USER_ROLES } from '../../src/common/factories/enum-values';

describeE2E('Users E2E', (getHelpers) => {
  it('GET /users - get all users', async () => {
    const { admin } = getHelpers();
    const users = await assertedGet<UserResponseDto[]>(
      `${API_PREFIX}/users`,
      { token: admin.bearer },
      HttpStatus.OK,
    );

    expect(Array.isArray(users)).toBe(true);
  });

  it('POST /users - create new user', async () => {
    const { admin } = getHelpers();
    const createDto: CreateUserDto = UserFactory.makeCreateDto({ roleCode: USER_ROLES.STAFF });

    const user = await assertedPost<UserResponseDto>(
      `${API_PREFIX}/users`,
      createDto,
      { token: admin.bearer },
      HttpStatus.CREATED,
    );

    expect(user.id).toBeDefined();
    expect(user.email).toBe(createDto.email);
    expect(user.roleCode).toBe(createDto.roleCode);
    expect(user.slug).toBeDefined();
  });

  it('PATCH /users/:id - update user', async () => {
    const { admin } = getHelpers();
    const createDto: CreateUserDto = UserFactory.makeCreateDto({ roleCode: USER_ROLES.STAFF });
    const createdUser = await assertedPost<UserResponseDto>(
      `${API_PREFIX}/users`,
      createDto,
      { token: admin.bearer },
      HttpStatus.CREATED,
    );

    const updateDto: UpdateUserDto = UserFactory.makeUpdateDto({ firstName: 'UpdatedName' });

    const updatedUser = await assertedPatch<UserResponseDto>(
      `${API_PREFIX}/users/${createdUser.id}`,
      updateDto,
      { token: admin.bearer },
      HttpStatus.OK,
    );

    expect(updatedUser.id).toBe(createdUser.id);
    expect(updatedUser.firstName).toBe(updateDto.firstName);
  });

  it('DELETE /users/:id - delete user', async () => {
    const { admin } = getHelpers();
    const createDto: CreateUserDto = UserFactory.makeCreateDto({ roleCode: USER_ROLES.STAFF });
    const createdUser = await assertedPost<UserResponseDto>(
      `${API_PREFIX}/users`,
      createDto,
      { token: admin.bearer },
      HttpStatus.CREATED,
    );

    await assertedDelete(
      `${API_PREFIX}/users/${createdUser.id}`,
      { token: admin.bearer },
      HttpStatus.NO_CONTENT,
    );

    const users = await assertedGet<UserResponseDto[]>(
      `${API_PREFIX}/users`,
      { token: admin.bearer },
      HttpStatus.OK,
    );
    expect(users.find((u) => u.id === createdUser.id)).toBeUndefined();
  });
});
