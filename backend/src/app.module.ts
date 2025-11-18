import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbBaseConfig } from './config';
import { UsersModule } from './modules/users/users.module';
import { EnumTypesModule } from './modules/enum-types/enum-types.module';

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
  ],
})
export class AppModule {}