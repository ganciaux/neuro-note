export async function attachRelation<TEntity extends { id: any }, TRelated>(
  repo: { find: Function },
  entity: TEntity,
  fieldName: keyof TEntity,
  entityType: string,
): Promise<TEntity> {
  const results = await repo.find({
    where: {
      entityType,
      entityId: entity.id,
    },
  });

  // @ts-expect-error
  entity[fieldName] = results as TRelated[];

  return entity;
}
