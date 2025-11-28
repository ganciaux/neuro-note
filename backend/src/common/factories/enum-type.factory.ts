import { faker } from '@faker-js/faker';
import { EnumType } from '../../modules/enum-types/entities/enum-type.entity';

export const EnumTypeFactory = {
  makeEntity: (overrides?: Partial<EnumType>): EnumType => {
    const base: EnumType = {
      id: faker.string.uuid(),
      type: 'user_role',
      code: 'user_role_admin',
      shortCode: 'admin',
      label: 'Administrator',
    };
    return { ...base, ...overrides };
  },
};
