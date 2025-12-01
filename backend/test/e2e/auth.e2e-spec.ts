import { HttpStatus } from '@nestjs/common';
import { describeE2E } from './e2e-setup';
import { API_PREFIX } from '../e2e/jest-e2e-utils';
import { assertedPost, assertedGet } from '../utils/request-helpers';
import { LoginResponseDto } from '../../src/modules/auth/dto/login-response.dto';
import { JwtUser } from '../../src/modules/auth/models';

describeE2E('Auth E2E', (getHelpers) => {
  describe('POST /auth/login', () => {
    it('should login as admin', async () => {
      const { admin } = getHelpers();
      const res = await assertedPost<LoginResponseDto>(
        `${API_PREFIX}/auth/login`,
        { email: admin.credentials.email, password: admin.credentials.password },
        {},
        HttpStatus.OK,
      );

      expect(res.accessToken).toBeDefined();
      expect(res.user.id).toBe(admin.user.id);
    });

    it('should login as user', async () => {
      const { user } = getHelpers();
      const res = await assertedPost<LoginResponseDto>(
        `${API_PREFIX}/auth/login`,
        { email: user.credentials.email, password: user.credentials.password },
        {},
        HttpStatus.OK,
      );

      expect(res.accessToken).toBeDefined();
      expect(res.user.id).toBe(user.user.id);
    });

    it('should fail with wrong credentials', async () => {
      const { user } = getHelpers();
      await assertedPost(
        `${API_PREFIX}/auth/login`,
        { email: user.credentials.email, password: 'wrongpassword' },
        {},
        HttpStatus.UNAUTHORIZED,
      );
    });
  });

  describe('GET /auth/me', () => {
    it('should return admin info', async () => {
      const { admin } = getHelpers();
      const res = await assertedGet<JwtUser>(
        `${API_PREFIX}/auth/me`,
        { token: admin.bearer },
        HttpStatus.OK,
      );
      expect(res.id).toBe(admin.user.id);
    });

    it('should return user info', async () => {
      const { user } = getHelpers();
      const res = await assertedGet<JwtUser>(
        `${API_PREFIX}/auth/me`,
        { token: user.bearer },
        HttpStatus.OK,
      );
      expect(res.id).toBe(user.user.id);
    });

    it('should fail without token', async () => {
      await assertedGet(`${API_PREFIX}/auth/me`, {}, HttpStatus.UNAUTHORIZED);
    });
  });
});
