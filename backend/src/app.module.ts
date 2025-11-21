import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbBaseConfig } from './config';
import { UsersModule } from './modules/users/users.module';
import { EnumTypesModule } from './modules/enum-types/enum-types.module';
import { AuthModule } from './modules/auth/auth.module';
import { PatientsModule } from './modules/patients/patients.module';

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
  ],
})
export class AppModule {}
