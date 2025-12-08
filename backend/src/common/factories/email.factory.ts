import { faker } from '@faker-js/faker';

export const makeFakeEmail = (firstName: string, lastName: string): string => {
  const uniquePrefix = faker.string.uuid();
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  return `${uniquePrefix}_${email}`;
};
