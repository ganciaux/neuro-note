import { faker } from '@faker-js/faker';

export const fakerDateOnly = (options?: Parameters<typeof faker.date.birthdate>[0]): Date => {
  const d = faker.date.birthdate(options);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};

export const fakerDateTime = (): Date => {
  const d = faker.date.recent();
  return new Date(d.toISOString());
};

export const formatDateOnly = (date?: Date | string | null): string | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
};
