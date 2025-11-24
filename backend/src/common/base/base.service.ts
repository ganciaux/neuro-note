import { Repository, ObjectLiteral, FindOptionsWhere, DeepPartial, Not, IsNull } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { toDto, toDtoArray } from '../utils/transform-to-dto';
import { CatchTypeOrmError } from '../decorators/catch-typeorm-error.decorator';

export abstract class BaseService<Entity extends ObjectLiteral, ResponseDto, CreateDto, UpdateDto> {
  protected abstract readonly responseDtoClass: new () => ResponseDto;
  protected abstract readonly idKey: keyof Entity;
  protected abstract readonly entityLabel: string;

  constructor(protected readonly repository: Repository<Entity>) {}

  protected async beforeCreate(_dto: CreateDto): Promise<void> {
    return Promise.resolve();
  }

  protected async afterCreate(_entity: Entity): Promise<void> {
    return Promise.resolve();
  }

  protected async beforeUpdate(_entity: Entity, _dto: UpdateDto): Promise<void> {
    return Promise.resolve();
  }

  protected async afterUpdate(_entity: Entity): Promise<void> {
    return Promise.resolve();
  }

  protected async beforeDelete(_entity: Entity): Promise<void> {
    return Promise.resolve();
  }

  protected async afterDelete(_entity: Entity): Promise<void> {
    return Promise.resolve();
  }

  protected async extendEntity(entity: Entity): Promise<Entity> {
    return Promise.resolve(entity);
  }

  async findAll(): Promise<ResponseDto[]> {
    const entities = await this.repository.find();
    return toDtoArray(this.responseDtoClass, entities);
  }

  async findOne(id: string | number): Promise<ResponseDto> {
    const entity = await this.findRaw(id);
    return toDto(this.responseDtoClass, entity);
  }

  async findOneExtended(id: string | number): Promise<ResponseDto> {
    const entity: Entity = await this.findRaw(id);
    const extended: Entity = await this.extendEntity(entity);
    return toDto(this.responseDtoClass, extended);
  }

  protected async findRaw(id: string | number): Promise<Entity> {
    const where = { [this.idKey]: id } as FindOptionsWhere<Entity>;
    const entity = await this.repository.findOne({ where });
    if (!entity) throw new NotFoundException(`${this.entityLabel} #${id} not found`);
    return entity;
  }

  @CatchTypeOrmError()
  async create(dto: CreateDto): Promise<ResponseDto> {
    await this.beforeCreate(dto);
    const entity = this.repository.create(dto as unknown as DeepPartial<Entity>);
    const saved = await this.repository.save(entity);
    await this.afterCreate(saved);
    return toDto(this.responseDtoClass, saved);
  }

  @CatchTypeOrmError()
  async update(id: string | number, dto: UpdateDto): Promise<ResponseDto> {
    const where = { [this.idKey]: id } as FindOptionsWhere<Entity>;

    const entity = await this.repository.findOne({ where });
    if (!entity) throw new NotFoundException(`${this.entityLabel} #${id} not found`);

    await this.beforeUpdate(entity, dto);

    Object.assign(entity, dto);
    const saved = await this.repository.save(entity);

    await this.afterUpdate(saved);

    return toDto(this.responseDtoClass, saved);
  }

  @CatchTypeOrmError()
  async delete(id: string | number): Promise<void> {
    const where = { [this.idKey]: id } as FindOptionsWhere<Entity>;
    const existing = await this.repository.findOne({ where });

    if (!existing) throw new NotFoundException(`${this.entityLabel} #${id} not found`);

    await this.beforeDelete(existing);

    await this.repository.delete(where);

    await this.afterDelete(existing);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async restore(id: string): Promise<ResponseDto> {
    await this.repository.restore(id);
    const where = { [this.idKey]: id } as FindOptionsWhere<Entity>;
    const restoredEntity = this.repository.findOneOrFail({ where });
    return toDto(this.responseDtoClass, restoredEntity);
  }

  count(): Promise<number> {
    return this.repository.count();
  }

  async findDeleted(): Promise<ResponseDto[]> {
    const whereClause = {
      deletedAt: Not(IsNull()) as unknown as Entity[Extract<keyof Entity, 'deletedAt'>],
    } satisfies FindOptionsWhere<Entity>;

    const entities = await this.repository.find({
      withDeleted: true,
      where: whereClause,
    });

    return toDtoArray(this.responseDtoClass, entities);
  }
}
