import { UserResponseDto } from '../../src/modules/users/dto/user-response.dto';
import { LoginDto } from '../../src/modules/auth/dto/login.dto';

export type AuthFactoryResult = {
  user: UserResponseDto;
  accessToken: string;
  bearer: string;
  loginUser: UserResponseDto;
  credentials: LoginDto;
};
