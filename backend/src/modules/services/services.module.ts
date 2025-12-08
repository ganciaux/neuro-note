import { Module } from '@nestjs/common';
import { ServicesService } from './services/services.service';
import { ServicesController } from './controllers/services.controller';
import { ServicesRepository } from './repositories/services.repository';
import { Service, ServiceItem } from './entities/service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServiceItem])],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService, ServicesRepository],
})
export class ServicesModule {}
