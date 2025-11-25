import { FilterOperator } from './filter-operators.enum';

export interface FilterDefinition {
  operator: FilterOperator;
  field: string;
  value: any;
}
