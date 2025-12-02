import slugify from 'slugify';
import { nanoid } from 'nanoid';

export function generateSlug(base: string, randomPart: string = nanoid(4)) {
  const slugBase = slugify(base, { lower: true });
  return `${slugBase}-${randomPart}`;
}
