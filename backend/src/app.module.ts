import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbBaseConfig } from './config';
import { UsersModule } from './modules/users/users.module';
import { EnumTypesModule } from './modules/enum-types/enum-types.module';
import { AuthModule } from './modules/auth/auth.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { CommonModule } from './common/common.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbBaseConfig,
      type: 'postgres',
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
export class AppModule {}
