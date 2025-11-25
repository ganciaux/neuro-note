import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { applyFilters } from '../query-filters/filter-builder';
import { FilterOptionsDto } from '../query-filters/filter-options.dto';

export function applyQuery<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  options: FilterOptionsDto,
  alias: string,
) {
  applyFilters(qb, options, alias);

  const page = options.page ?? 1;
  const limit = options.limit ?? 20;

  qb.skip((page - 1) * limit).take(limit);

  return qb;
}
