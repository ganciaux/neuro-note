import slugify from 'slugify';
import { nanoid } from 'nanoid';

export function generateSlug(base: string, randomPart: string = nanoid(4)) {
  const slugBase = slugify(base, { lower: true });
  return `${slugBase}-${randomPart}`;
}

export const generateUserSlug = (user: { firstName: string; lastName: string }): string => {
  return generateSlug(`${user.firstName}-${user.lastName}`);
};

export const generatePatientSlug = (user: { firstName: string; lastName: string }): string => {
  return generateSlug(`${user.firstName}-${user.lastName}`);
};

export const generateServiceSlug = (code: string): string => {
  return generateSlug(code);
};