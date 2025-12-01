import { HttpStatus } from '@nestjs/common';
import { UserResponseDto } from '../../src/modules/users/dto/user-response.dto';
import { adminToken, API_PREFIX, closeApp } from './jest-e2e-utils';
import { assertedGet } from '../../test/utils/request-helpers';

describe('Users E2E', () => {
  afterAll(async () => {
    await closeApp();
  });

  it('GET /users', async () => {
    const users = await assertedGet<UserResponseDto[]>(
      `${API_PREFIX}/users`,
      { token: adminToken },
      HttpStatus.OK,
    );

    expect(Array.isArray(users)).toBe(true);
  });
});
