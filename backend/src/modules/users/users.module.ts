import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { EnumType } from '../enum-types/entities/enum-type.entity';
import { EnumTypesModule } from '../enum-types/enum-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EnumType]),
    EnumTypesModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
