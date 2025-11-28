import slugify from 'slugify';
import { nanoid } from 'nanoid';

export function generateSlug(base: string, length = 4): string {
  const slugBase = slugify(base, { lower: true });
  return `${slugBase}-${nanoid(length)}`;
}
