import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { User } from '../../users/entities/user.entity';
import { JwtPayload } from '../models';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RegisterDto } from '../dto/register.dto';
import { toDto } from '../../../common/utils/transform-to-dto';
import { USER_ROLES } from '../../../common/factories/enum-values';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await this.usersService.validatePassword(user, password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.validateUser(email, password);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.roleCode,
    };

    return {
      accessToken: this.jwtService.sign<JwtPayload>(payload),
      user: toDto(UserResponseDto, user),
    };
  }

  async register(dto: RegisterDto): Promise<LoginResponseDto> {
    const user = await this.usersService.create({
      ...dto,
      roleCode: USER_ROLES.STAFF,
    });

    const token = this.jwtService.sign({ id: user.id, role: USER_ROLES.STAFF });

    return {
      user,
      accessToken: token,
    };
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }
}
