import { faker } from '@faker-js/faker';
import { Service, ServiceItem } from '../../modules/services/entities/service.entity';
import { CreateServiceDto } from '../../modules/services/dto/create-service.dto';
import { UpdateServiceDto } from '../../modules/services/dto/update-service.dto';
import { ServiceResponseDto } from '../../modules/services/dto/service-response.dto';
import { generateSlug } from '../utils/slug.util';
import { SERVICE_CATEGORY } from './enum-values';

export const ServiceFactory = {
  makeEntity: (overrides?: Partial<Service>, itemsCount = 0): Service => {
    const base = new Service();
    base.id = faker.string.uuid();
    base.code = faker.commerce.productName();
    base.categoryCode = SERVICE_CATEGORY.CONSULT;
    base.labelInternal = faker.commerce.productName();
    base.labelInvoice = faker.commerce.productName();
    base.price = parseFloat(faker.commerce.price());
    base.isBundle = itemsCount > 0;
    base.isActive = true;
    base.createdAt = new Date();
    base.updatedAt = new Date();
    base.deletedAt = undefined;
    base.slug = generateSlug(base.code);

    if (base.isBundle && itemsCount > 0) {
      base.items = Array.from({ length: itemsCount }).map(() =>
        ServiceItemFactory.makeEntity({ bundle: base }),
      );
    }

    if (overrides) {
      Object.assign(base, overrides);
    }

    return base;
  },

  makeCreateDto: (overrides?: Partial<CreateServiceDto>): CreateServiceDto => {
    const code = faker.commerce.productName();
    const base: CreateServiceDto = {
      code,
      categoryCode: SERVICE_CATEGORY.CONSULT,
      labelInternal: faker.commerce.productName(),
      labelInvoice: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      isBundle: false,
      isActive: true,
      items: [],
    };

    return { ...base, ...overrides };
  },

  makeUpdateDto: (overrides?: Partial<UpdateServiceDto>): UpdateServiceDto => {
    const base: UpdateServiceDto = {
      code: faker.commerce.productName(),
      labelInternal: faker.commerce.productName(),
      labelInvoice: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      isActive: true,
    };

    return { ...base, ...overrides };
  },

  makeResponseDto: (overrides?: Partial<ServiceResponseDto>): ServiceResponseDto => {
    const base = new ServiceResponseDto();
    const code = faker.commerce.productName();

    Object.assign(base, {
      id: faker.string.uuid(),
      slug: generateSlug(code),
      code,
      labelInternal: faker.commerce.productName(),
      labelInvoice: faker.commerce.productName(),
      categoryCode: 'default_category',
      price: parseFloat(faker.commerce.price()),
      isBundle: faker.datatype.boolean(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [],
      ...overrides,
    });

    return base;
  },
};

export const ServiceItemFactory = {
  makeEntity: (overrides?: Partial<ServiceItem>): ServiceItem => {
    const base = new ServiceItem();

    const bundle = overrides?.bundle ?? ServiceFactory.makeEntity({ isBundle: true }, 0);

    base.bundle = bundle;
    base.bundleId = bundle.id;

    const service = overrides?.service ?? bundle;
    base.service = service;
    base.serviceId = service.id;

    base.quantity = faker.number.int({ min: 1, max: 10 });

    if (overrides) {
      Object.assign(base, overrides);
    }

    return base;
  },
};
