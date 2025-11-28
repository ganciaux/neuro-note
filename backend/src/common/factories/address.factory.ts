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
    typeCode: ADDRESS_TYPE.HOME,
    street: faker.location.streetAddress(),
    postalCode: faker.location.zipCode(),
    city: faker.location.city(),
    countryCode: ADDRESS_COUNTRY.LU,
    label: 'Adresse principale',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
    ...overrides,
  }),

  makeCreateDto: (overrides?: Partial<CreateAddressDto>): CreateAddressDto => ({
    entityType: ADDRESS_ENTITY.PATIENT,
    entityId: faker.string.uuid(),
    typeCode: ADDRESS_TYPE.HOME,
    street: faker.location.streetAddress(),
    postalCode: faker.location.zipCode(),
    city: faker.location.city(),
    countryCode: ADDRESS_COUNTRY.LU,
    label: 'Adresse principale',
    ...overrides,
  }),

  makeUpdateDto: (overrides?: Partial<UpdateAddressDto>): UpdateAddressDto => ({
    typeCode: ADDRESS_TYPE.HOME,
    street: faker.location.streetAddress(),
    postalCode: faker.location.zipCode(),
    city: faker.location.city(),
    countryCode: ADDRESS_COUNTRY.LU,
    label: 'Adresse mise à jour',
    ...overrides,
  }),

  makeResponseDto: (overrides?: Partial<AddressResponseDto>): AddressResponseDto => ({
    id: faker.string.uuid(),
    entityType: ADDRESS_ENTITY.PATIENT,
    entityId: faker.string.uuid(),
    typeCode: ADDRESS_TYPE.HOME,
    street: faker.location.streetAddress(),
    postalCode: faker.location.zipCode(),
    city: faker.location.city(),
    countryCode: ADDRESS_COUNTRY.LU,
    label: 'Adresse principale',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
};
