import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { BaseService } from '../../../common/base/base.service';
import { Service } from '../entities/service.entity';
import { ServiceResponseDto } from '../dto/service-response.dto';
import { ServicesRepository } from '../repositories/services.repository';
import { CatchTypeOrmError } from '../../../common/decorators/catch-typeorm-error.decorator';
import { toDto } from '../../../common/utils/transform-to-dto';

@Injectable()
export class ServicesService extends BaseService<
  Service,
  ServiceResponseDto,
  CreateServiceDto,
  UpdateServiceDto
> {
  protected readonly responseDtoClass = ServiceResponseDto;
  protected readonly idKey: keyof Service = 'id';
  protected readonly entityLabel = 'Service';
  protected alias = 'service';

  constructor(private readonly serviceRepo: ServicesRepository) {
    super(serviceRepo);
  }

  @CatchTypeOrmError()
  async createBundleWithItems(createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
    const savedService = await this.serviceRepo.createBundleWithItems(createServiceDto);

    return toDto(ServiceResponseDto, savedService);
  }
}
