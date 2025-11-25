import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { getFieldOperators } from './filter.decorators';
import { FilterOperator } from './filter-operators.enum';
import { FilterFieldDto } from './filter-field.dto';

export function applyFilters<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  dto: any,
  alias: string,
) {
  for (const [field, condition] of Object.entries(dto)) {
    if (!condition) continue;

    if (['page', 'limit', 'search', 'sortBy', 'sortDir'].includes(field)) continue;

    const operators = getFieldOperators(dto, field);

    if (!operators || operators.length === 0) continue;

    if (!(condition instanceof FilterFieldDto)) continue;

    const operator = condition.operator ?? FilterOperator.EQ;

    if (!operators.includes(operator)) {
      throw new Error(`Operator ${operator} not allowed for field ${field}`);
    }

    let value: any;

    switch (operator) {
      case FilterOperator.EQ:
      case FilterOperator.LIKE:
      case FilterOperator.GT:
      case FilterOperator.GTE:
      case FilterOperator.LT:
      case FilterOperator.LTE:
        value = condition.value;
        break;
      case FilterOperator.IN:
        value = condition.values;
        break;
      case FilterOperator.BETWEEN:
        value = [condition.from, condition.to];
        break;
    }

    const paramKey = `${field}_${operator}`;

    switch (operator) {
      case FilterOperator.EQ:
        qb.andWhere(`${alias}.${field} = :${paramKey}`, { [paramKey]: value });
        break;

      case FilterOperator.LIKE:
        qb.andWhere(`${alias}.${field} ILIKE :${paramKey}`, { [paramKey]: `%${value}%` });
        break;

      case FilterOperator.IN:
        qb.andWhere(`${alias}.${field} IN (:...${paramKey})`, { [paramKey]: value });
        break;

      case FilterOperator.GT:
      case FilterOperator.GTE:
      case FilterOperator.LT:
      case FilterOperator.LTE:
        qb.andWhere(`${alias}.${field} ${operatorToSql(operator)} :${paramKey}`, {
          [paramKey]: value,
        });
        break;

      case FilterOperator.BETWEEN:
        qb.andWhere(`${alias}.${field} BETWEEN :from AND :to`, {
          from: condition.from,
          to: condition.to,
        });
        break;
    }
  }

  return qb;
}

function operatorToSql(op: FilterOperator) {
  switch (op) {
    case FilterOperator.GT:
      return '>';
    case FilterOperator.GTE:
      return '>=';
    case FilterOperator.LT:
      return '<';
    case FilterOperator.LTE:
      return '<=';
  }
}
