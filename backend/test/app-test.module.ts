import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/modules/users/users.module';
import { EnumTypesModule } from '../src/modules/enum-types/enum-types.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { PatientsModule } from '../src/modules/patients/patients.module';
import { AddressesModule } from '../src/modules/addresses/addresses.module';
import { CommonModule } from '../src/common/common.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.TEST_DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    EnumTypesModule,
    AuthModule,
    PatientsModule,
    AddressesModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppTestModule {}
