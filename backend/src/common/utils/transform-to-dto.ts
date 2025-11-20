import { plainToInstance } from 'class-transformer';

export function toDto<T, V>(dtoClass: new () => T, entity: V, excludeExtraneousValues: boolean = true,): T {
  return plainToInstance(dtoClass, entity, { excludeExtraneousValues });
}

export function toDtoArray<T, V>(dtoClass: new () => T, entities: V[], excludeExtraneousValues: boolean = true,): T[] {
  return entities.map(e => toDto(dtoClass, e, excludeExtraneousValues));
}
