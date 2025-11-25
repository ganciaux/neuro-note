import 'reflect-metadata';
import { FilterOperator } from './filter-operators.enum';

export function Filterable(operators: FilterOperator[]) {
  return (target: any, propertyKey: string | symbol) => {
    Reflect.defineMetadata('filter:operators', operators, target, propertyKey);
  };
}

export function getFieldOperators(targetInstance: any, property: string): FilterOperator[] {
  if (!targetInstance) return [];
  const proto = Object.getPrototypeOf(targetInstance);
  if (!proto) return [];
  return Reflect.getMetadata('filter:operators', proto, property) || [];
}
