import { faker } from '@faker-js/faker';
import { Address } from '../../modules/addresses/entities/address.entity';
import { ADDRESS_ENTITY, ADDRESS_TYPE, ADDRESS_COUNTRY } from './enum-values';
import { CreateAddressDto } from '../../modules/addresses/dto/create-address.dto';
import { UpdateAddressDto } from '../../modules/addresses/dto/update-address.dto';
import { AddressResponseDto } from '../../modules/addresses/dto/address-response.dto';

export const AddressFactory = {
  makeEntity: (overrides?: Partial<Address>): Address => ({
    id: faker.string.uuid(),
    entityType: ADDRESS_ENTITY.PATIENT,
    entityId: faker.string.uuid(),
    typeCode: faker.helpers.arrayElement(Object.values(ADDRESS_TYPE)),
    street: faker.location.streetAddress(),
    postalCode: faker.location.zipCode(),
    city: faker.location.city(),
    countryCode: faker.helpers.arrayElement(Object.values(ADDRESS_COUNTRY)),
    label: faker.lorem.words(2),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
    ...overrides,
  }),

  makeCreateDto: (overrides?: Partial<CreateAddressDto>): CreateAddressDto => ({
    entityType: ADDRESS_ENTITY.PATIENT,
    entityId: faker.string.uuid(),
    typeCode: faker.helpers.arrayElement(Object.values(ADDRESS_TYPE)),
    street: faker.location.streetAddress(),
    postalCode: faker.location.zipCode(),
    city: faker.location.city(),
    countryCode: faker.helpers.arrayElement(Object.values(ADDRESS_COUNTRY)),
    label: faker.lorem.words(2),
    ...overrides,
  }),

  makeUpdateDto: (overrides?: Partial<UpdateAddressDto>): UpdateAddressDto => ({
    typeCode: faker.helpers.arrayElement(Object.values(ADDRESS_TYPE)),
    street: faker.location.streetAddress(),
    postalCode: faker.location.zipCode(),
    city: faker.location.city(),
    countryCode: faker.helpers.arrayElement(Object.values(ADDRESS_COUNTRY)),
    label: faker.lorem.words(2),
    ...overrides,
  }),

  makeResponseDto: (overrides?: Partial<AddressResponseDto>): AddressResponseDto => ({
    id: faker.string.uuid(),
    entityType: ADDRESS_ENTITY.PATIENT,
    entityId: faker.string.uuid(),
    typeCode: faker.helpers.arrayElement(Object.values(ADDRESS_TYPE)),
    street: faker.location.streetAddress(),
    postalCode: faker.location.zipCode(),
    city: faker.location.city(),
    countryCode: faker.helpers.arrayElement(Object.values(ADDRESS_COUNTRY)),
    label: faker.lorem.words(2),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
};
