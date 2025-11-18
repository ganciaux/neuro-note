import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { EnumTypesModule } from './modules/enum-types/enum-types.module';

@Module({
  imports: [UsersModule, EnumTypesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
